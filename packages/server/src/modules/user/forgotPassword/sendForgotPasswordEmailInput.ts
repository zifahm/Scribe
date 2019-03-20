import { InputType, Field } from "type-graphql";
import { IsEmail, IsNotEmpty } from "class-validator";

@InputType()
export class SendForgotPasswrodEmailInput {
  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
