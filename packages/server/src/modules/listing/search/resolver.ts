import { Arg, Query, Resolver } from "type-graphql";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Listing } from "../../../entity/Listing";
@Resolver(Listing)
export class SearchListing {
  @InjectRepository(Listing)
  private readonly listingRepo: Repository<Listing>;

  @Query(() => [Listing])
  async searchListings(
    @Arg("lat") lat: number,
    @Arg("lng") lng: number,
    @Arg("zoomLevel") zoomLevel: number
  ) {
    const searchedListings = await this.listingRepo
      .createQueryBuilder("listing")
      .where(
        "ST_DWithin(geom, ST_MakePoint(:lat,:lng)::geography, :zoomLevel)",
        {
          lat,
          lng,
          zoomLevel
        }
      )
      .getMany();
    return searchedListings;
  }
}
