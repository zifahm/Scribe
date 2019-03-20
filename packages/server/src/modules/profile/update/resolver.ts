import { Arg, Authorized, Ctx, Mutation, Resolver } from "type-graphql";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import { User } from "../../../entity/User";
import { Mycontext } from "../../../types/Context";
import { ProfileInput } from "./profileInput";
import console = require("console");

@Resolver(User)
export class ProfileUpdateResolver {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>
  ) {}
  @Authorized()
  @Mutation(() => Boolean, { nullable: true })
  async userProfileUpdate(
    @Arg("profileInput") profileInput: ProfileInput,
    @Ctx() ctx: Mycontext
  ) {
    console.log(profileInput, "profile input");
    const user = await this.userRepo.update(
      { id: ctx.req.session && ctx.req.session.userId },
      profileInput
    );
    if (!user) {
      return false;
    }
    return true;
  }
}
