import { Arg, Authorized, Ctx, Mutation, Resolver } from "type-graphql";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Listing } from "../../../entity/Listing";
import { Mycontext } from "../../../types/Context";
import { CreateListingInput } from "./createListingInput";

@Resolver(Listing)
export class CreateListing {
  constructor(
    @InjectRepository(Listing)
    private readonly listingRepo: Repository<Listing>
  ) {}
  @Authorized()
  @Mutation(() => Boolean, { nullable: true })
  async createListing(
    @Arg("createListingInput") createListingInput: CreateListingInput,
    @Ctx() ctx: Mycontext
  ): Promise<boolean> {
    await this.listingRepo.save({
      ...createListingInput,
      geom: {
        coordinates: [
          createListingInput.latitude,
          createListingInput.longitude
        ],
        type: "Point"
      },
      userId: ctx.req.session!.userId
    });

    return true;
  }
}
