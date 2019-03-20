import { InputType, Field } from "type-graphql";
import { User } from "../../../entity/User";
import { IsEmail, IsNotEmpty } from "class-validator";

@InputType()
export class LoginInput implements Partial<User> {
  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  password: string;
}
