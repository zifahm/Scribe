import * as bcrypt from "bcrypt";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import { FORGOT_PASSWORD_PREFIX } from "../../../constants";
import { User } from "../../../entity/User";
import { Mycontext } from "../../../types/Context";
import { createForgotPasswordLink } from "../../../utils/createForgotPasswordLink";
import { sendEmailToUser } from "../../../utils/sendEmail";
import { ErrorResponse } from "../../shared/errorResponse";
import { expiredKeyError } from "./errorMessages";
import { ForgotPasswordChangeInput } from "./forgotPasswordChangeInput";
import { SendForgotPasswrodEmailInput } from "./sendForgotPasswordEmailInput";

@Resolver(User)
export class ForgotPasswordResolver {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>
  ) {}

  @Mutation(() => Boolean, { nullable: true })
  async sendForgotPasswordEmail(
    @Arg("sendForgotPasswordEmailInput")
    sendForgotPasswordInput: SendForgotPasswrodEmailInput,
    @Ctx() ctx: Mycontext
  ) {
    const user = await this.userRepo.findOne({
      where: { email: sendForgotPasswordInput.email }
    });
    if (!user) {
      return false;
    }

    const url = await createForgotPasswordLink(
      process.env.FRONTEND_HOST!,
      user.id,
      ctx.redis
    );
    await sendEmailToUser(sendForgotPasswordInput.email, url, "reset password");
    return true;
  }

  @Mutation(() => [ErrorResponse], { nullable: true })
  async forgotPasswordChange(
    @Arg("forgotPasswordChangeInput")
    forgotPasswordChangeInput: ForgotPasswordChangeInput,
    @Ctx() ctx: Mycontext
  ) {
    const redisKey = `${FORGOT_PASSWORD_PREFIX}${
      forgotPasswordChangeInput.key
    }`;

    const userId = await ctx.redis.get(redisKey);
    if (!userId) {
      return [
        {
          path: "newPassword",
          message: expiredKeyError
        }
      ];
    }

    const hashedPassword = await bcrypt.hash(
      forgotPasswordChangeInput.newPassword,
      10
    );

    const updatePromise = this.userRepo.update(
      { id: userId },
      { forgotPasswordLocked: false, password: hashedPassword }
    );

    const deleteKeyPromise = ctx.redis.del(redisKey);

    await Promise.all([updatePromise, deleteKeyPromise]);

    // todo delete all previous sessions when password has changed to new
    // todo forgotPasswordLocked entity is always false in login and here as well, it does not do anything, thought of locking the account
    // when user tries to send email for forgot password. but that makes anybody can lock someones account.s

    return null;
  }
}
