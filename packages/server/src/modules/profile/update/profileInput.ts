import { IsString } from "class-validator";
import * as GraphQLJSON from "graphql-type-json";
import { Field, InputType } from "type-graphql";
import { User } from "../../../entity/User";
import { SocialMedia } from "../../../types/SocialMedia";

@InputType()
export class ProfileInput implements Partial<User> {
  @Field()
  @IsString()
  biography: string;

  @Field()
  @IsString()
  avatar: string;

  @Field(() => GraphQLJSON)
  socialMedia: SocialMedia;
}
