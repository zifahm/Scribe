import * as bcrypt from "bcrypt";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import { REDIS_SESSION_ID_PREFIX } from "../../../constants";
import { User } from "../../../entity/User";
import { Mycontext } from "../../../types/Context";
import { ErrorResponse } from "../../shared/errorResponse";
import { errorMessage, forgotPasswordLockedError } from "./errorMessages";
import { LoginInput } from "./loginInput";

@Resolver(User)
export class LoginResolver {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>
  ) {}

  @Mutation(() => [ErrorResponse], { nullable: true })
  async login(
    @Arg("loginInput") loginInput: LoginInput,
    @Ctx() ctx: Mycontext
  ): Promise<ErrorResponse[] | null> {
    const { email, password } = loginInput;

    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) {
      return errorMessage;
    }

    if (user.password === null) {
      return [
        {
          path: "password",
          message: "try loging in by google"
        }
      ];
    }

    if (!user.confirmed) {
      return [{ path: "email", message: "please confirm you email to login" }];
    }
    if (user.forgotPasswordLocked) {
      return [
        {
          path: "email",
          message: forgotPasswordLockedError
        }
      ];
    }
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return errorMessage;
    }

    ctx.req.session!.userId = await user.id;

    if (ctx.req.sessionID) {
      await ctx.redis.lpush(
        `${REDIS_SESSION_ID_PREFIX}${user.id}`,
        ctx.req.sessionID
      );
    }
    return null;
  }
}
