import { Ctx, Mutation, Resolver } from "type-graphql";
import { REDIS_SESSION_ID_PREFIX } from "../../../constants";
import { Mycontext } from "../../../types/Context";

@Resolver()
export class LogoutResolver {
  @Mutation(() => Boolean, { nullable: true })
  async logoutUser(@Ctx() ctx: Mycontext) {
    if (ctx.req.session) {
      const { userId, id } = ctx.req.session;
      // to remove the current logged out session id from the list of mltiple session stored in a list
      await ctx.redis.lrem(`${REDIS_SESSION_ID_PREFIX}${userId}`, 0, id);
      // destroying the current session of the user
      await ctx.req.session.destroy(err => {
        console.log(err);
        return false;
      });
      ctx.res.clearCookie("qid");
    }
    return true;
  }
}

// multiple session logout

// if (req.session) {
//   const { userId } = req.session;

//   if (userId) {
//     const sessionIds = await redis.lrange(
//       `${REDIS_SESSION_ID_PREFIX}${userId}`,
//       0,
//       -1
//     );

//     const promises = [];
//     for (const value of sessionIds) {
//       promises.push(redis.del(`${REDIS_SESSION_PREFIX}${value}`));
//     }
//     await Promise.all(promises);
//     return true;
//   }
// }
// return false;
