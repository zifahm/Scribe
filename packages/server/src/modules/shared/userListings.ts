import * as GraphQLJSON from "graphql-type-json";
import { Field, ObjectType } from "type-graphql";
import { Listing } from "../../entity/Listing";
import { User } from "../../entity/User";
import { SocialMedia } from "../../types/SocialMedia";

@ObjectType()
export class UserListings implements Partial<User> {
  @Field()
  firstName: string;

  @Field(() => String, { nullable: true })
  lastName: string;

  @Field(() => GraphQLJSON, { nullable: true })
  socialMedia: SocialMedia;

  @Field({ nullable: true })
  biography: string;

  @Field({ nullable: true })
  avatar: string;

  @Field()
  createdAt: Date;

  @Field(() => [Listing], { nullable: true })
  listings: Promise<Listing[]>;
}
