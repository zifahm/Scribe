import { Arg, Query, Resolver } from "type-graphql";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import { User } from "../../../entity/User";
import { UserListings } from "../../shared/userListings";

@Resolver(User)
export class UserListing {
  @InjectRepository(User)
  private readonly userRepo: Repository<User>;

  @Query(() => [UserListings])
  async userListings(@Arg("id") id: string): Promise<UserListings[]> {
    const user = await this.userRepo.find({
      where: { id },
      relations: ["listings"]
    });
    return user;
  }
}
