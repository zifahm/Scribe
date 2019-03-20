import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString
} from "class-validator";
import { Field, Float, InputType } from "type-graphql";
import { Listing } from "../../../entity/Listing";

@InputType()
export class CreateListingInput implements Partial<Listing> {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  description: string;

  @Field({ nullable: true })
  @IsString()
  minimumHours: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  studioType: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  studioHours: string;

  @Field({ nullable: true })
  @IsString()
  pastClients: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  amenities: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  mainEquipments: string;

  @Field({ nullable: true })
  @IsString()
  policyRules: string;

  @Field(() => Float)
  @IsNotEmpty()
  latitude: number;

  @Field(() => Float)
  @IsNotEmpty()
  longitude: number;

  @Field(() => [String])
  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  pictureUrl: string[];

  @Field(() => Float)
  @IsNotEmpty()
  @IsInt()
  pricePerHour: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  address: string;
}
