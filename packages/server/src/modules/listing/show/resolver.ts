import { Arg, Query, Resolver } from "type-graphql";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Listing } from "../../../entity/Listing";

@Resolver(Listing)
export class ShowListing {
  constructor(
    @InjectRepository(Listing)
    private readonly listingRepo: Repository<Listing>
  ) {}
  @Query(() => Listing, { nullable: true })
  async showListing(@Arg("id") id: string) {
    return this.listingRepo.findOne(id);
  }
}
