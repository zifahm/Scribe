import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import { User } from "../../../entity/User";
import { Mycontext } from "../../../types/Context";
import { emailConfirmationLink } from "../../../utils/emailConfirmationLink";
import { sendEmailToUser } from "../../../utils/sendEmail";
import { ErrorResponse } from "../../shared/errorResponse";
import { RegisterInput } from "./registerInput";
// import { sendEmailToUser } from "../../../utils/sendEmail";
// import { emailConfirmationLink } from "../../../utils/emailConfirmationLink";
// import { Mycontext } from "../../../types/Context";
@Resolver(User)
export class RegisterResolver {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>
  ) {}

  @Mutation(() => [ErrorResponse], { nullable: true })
  async register(
    @Arg("registerInput") registerInput: RegisterInput,
    @Ctx() ctx: Mycontext
  ): Promise<ErrorResponse[] | null> {
    const userExist = await this.userRepo.findOne({
      where: { email: registerInput.email }
    });
    if (userExist) {
      return [
        {
          path: "email",
          message: "email already in use"
        }
      ];
    }
    const user = await this.userRepo.save(registerInput);

    sendEmailToUser(
      user.email,
      await emailConfirmationLink(user.id, ctx.redis),
      "confirm email"
    );
    return null;
  }
}
