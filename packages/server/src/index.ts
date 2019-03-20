import { ApolloError, ApolloServer } from "apollo-server-express";
import * as Store from "connect-redis";
import * as dotenv from "dotenv";
import * as express from "express";
import * as session from "express-session";
import { GraphQLError } from "graphql";
import * as passport from "passport";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { Container } from "typedi";
import { getConnection, getRepository, useContainer } from "typeorm";
import { v4 } from "uuid";
import { User } from "./entity/User";
import { DisplayError } from "./errors/DisplayErrors";
import { userLoader } from "./loaders/userLoader";
import { redis } from "./redis";
import { createTypeormConn } from "./utils/createTypeormConn";
import { logManager } from "./utils/logManager";
import { setupErrorHandling } from "./utils/shutdown";
dotenv.config();

const logger = logManager();
logger.info("Loading environment...");

useContainer(Container);
// tslint:disable-next-line:no-var-requires
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const SESSION_SECRET = process.env.SESSION_SECRET;
const RedisStore = Store(session);

const startServer = async () => {
  logger.info("Connecting database...");

  const conn = await createTypeormConn();
  if (conn) {
    logger.info("database connected ");
    await conn.runMigrations();
  }
  logger.info("Creating express server...");
  const app = express();

  logger.info("Creating GQL server...");
  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [__dirname + "/modules/**/resolver.*"],
      emitSchemaFile: true,
      dateScalarMode: "isoDate",
      authChecker: ({ context }) => {
        return context.req.session && context.req.session.userId;
      },
      container: Container
    }),
    context: ({ req, res }: any) => ({
      req,
      res,
      redis,
      userLoader: userLoader()
      // url: req.protocol + "://" + req.get("host") // to get the host url eg: localhost:4000
    }),

    formatError: (error: GraphQLError) => {
      if (
        error.originalError instanceof ApolloError ||
        error.originalError instanceof DisplayError ||
        error.message === "Argument Validation Error"
      ) {
        return error;
      }

      const errId = v4();
      console.log("errId: ", errId);
      console.log(error);
      console.log(JSON.stringify(error));

      return new GraphQLError(`Internal Error: ${errId}`);
    },
    engine: {
      apiKey: process.env.ENGINE_API_KEY,
      generateClientInfo: ({ request }) => {
        // @ts-ignore
        const headers = request.http as any & request.http.headers;
        if (headers) {
          return {
            clientName: headers["apollo-client-name"],
            clientVersion: headers["apollo-client-version"]
          };
        } else {
          return {
            clientName: "Unknown Client",
            clientVersion: "Unversioned"
          };
        }
      }
    }
  });

  app.use((req, _, next) => {
    const authorization = req.headers.authorization;

    if (authorization) {
      try {
        const qid = authorization.split(" ")[1];
        req.headers.cookie = `qid=${qid}`;
        // tslint:disable-next-line:no-empty
      } catch (_) {}
    }

    return next();
  });

  app.use(
    session({
      store: new RedisStore({ client: redis as any }),
      name: "qid",
      secret: SESSION_SECRET!,
      resave: false,
      saveUninitialized: false,
      cookie: { httpOnly: true, secure: process.env.NODE_ENV === "production" }
    })
  );

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.BACKEND_HOST}/auth/google/callback`
      },
      async (_: any, __: any, profile: any, cb: any) => {
        const userRepo = getRepository(User);

        const { id, emails, name } = profile;

        let user;

        user = await userRepo.findOne({ where: { googleId: id } });

        if (user) {
          return cb(null, { id: user.id });
        }

        if (!user) {
          if (!name.familyName) {
            user = await userRepo.save({
              firstName: name.givenName,
              email: emails[0].value,
              googleId: id
            });
            return cb(null, { id: user.id });
          } else {
            user = await userRepo.save({
              firstName: name.givenName,
              lastName: name.familyName,
              email: emails[0].value,
              googleId: id
            });
            return cb(null, { id: user.id });
          }
        }
      }
    )
  );
  app.use(passport.initialize());
  app.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"],
      session: false
    })
  );

  app.get(
    "/auth/google/callback",
    passport.authenticate("google", { session: false }),
    (req, res) => {
      req.session!.userId = req.user.id;
      res.redirect(`${process.env.FRONTEND_HOST}`);
    }
  );

  // app.get("/confirm/:id", async (req, res) => {
  //   const { id } = req.params;
  //   const userId = await redis.get(`${EMAIL_CONFIRM_PREFIX}${id}`);
  //   if (userId) {
  //     await User.update({ id: userId }, { confirmed: true });
  //     res.send("ok");
  //   } else {
  //     res.send("invalid");
  //   }
  // });

  const cors = {
    credentials: true,
    origin: process.env.FRONTEND_HOST
  };

  server.applyMiddleware({ app, cors }); // app is from an existing express app

  const nodeServer = app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
  setupErrorHandling({
    db: getConnection(),
    redisClient: redis,
    nodeServer,
    logger
  });
};

startServer();
