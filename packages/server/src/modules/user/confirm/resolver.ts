import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import { EMAIL_CONFIRM_PREFIX } from "../../../constants";
import { User } from "../../../entity/User";
import { Mycontext } from "../../../types/Context";

@Resolver(User)
export class ConfirmUserResolver {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>
  ) {}

  @Mutation(() => Boolean)
  async confirmUser(
    @Arg("token") token: string,
    @Ctx() ctx: Mycontext
  ): Promise<boolean> {
    const userId = await ctx.redis.get(`${EMAIL_CONFIRM_PREFIX}${token}`);

    if (!userId) {
      return false;
    }

    await this.userRepo.update({ id: userId }, { confirmed: true });
    await ctx.redis.del(`${EMAIL_CONFIRM_PREFIX}${token}`);

    return true;
  }
}
