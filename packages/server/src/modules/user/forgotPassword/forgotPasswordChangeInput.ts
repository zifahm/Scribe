import { InputType, Field } from "type-graphql";
import { IsNotEmpty, Length } from "class-validator";

@InputType()
export class ForgotPasswordChangeInput {
  @Field()
  @IsNotEmpty()
  @Length(8, 255)
  newPassword: string;

  @Field()
  key: string;
}
