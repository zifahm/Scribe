import { Ctx, Query, Resolver } from "type-graphql";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import { User } from "../../../entity/User";
import { Mycontext } from "../../../types/Context";

@Resolver(User)
export class MeResolver {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>
  ) {}

  @Query(() => User, { nullable: true })
  async me(@Ctx() ctx: Mycontext): Promise<User | undefined> {
    const { userId } = ctx.req.session!;
    return userId ? this.userRepo.findOne(userId) : undefined;
  }
}
