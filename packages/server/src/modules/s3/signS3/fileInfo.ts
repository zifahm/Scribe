import { Field, InputType } from "type-graphql";

@InputType()
export class FileInfo {
  @Field()
  name: string;

  @Field()
  type: string;

  @Field()
  originalName: string;
}
