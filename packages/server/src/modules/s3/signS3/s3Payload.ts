import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class S3Payload {
  @Field()
  signedUrl: string;

  @Field()
  fileType: string;

  @Field()
  originalName: string;
}
