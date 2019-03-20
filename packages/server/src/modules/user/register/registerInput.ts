import { IsAlpha, IsEmail, IsNotEmpty, Length } from "class-validator";
import { Field, InputType } from "type-graphql";
import { User } from "../../../entity/User";

@InputType()
export class RegisterInput implements Partial<User> {
  // dont worry about google auth, its taken care of in oauth bypassing lastname and password
  @Field()
  @IsNotEmpty()
  @IsAlpha()
  @Length(3, 255)
  firstName: string;

  @Field()
  @IsNotEmpty()
  @IsAlpha()
  lastName: string;

  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  @Length(8, 255)
  password: string;
}
