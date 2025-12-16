import fs from "fs/promises";
import Handlebars from "handlebars";
import { sendEmail } from "./mailer.js";

export class EmailUtil {
  async renderTemplate(templateName: string, context: Record<string, unknown>) {
    const templateSource = await fs.readFile(
      `src/emails/templates/${templateName}.template.hbs`,
      "utf-8"
    );

    const template = Handlebars.compile(templateSource);
    return template(context);
  }

  async sendResetPasswordEmail(email: string, token: string) {
    const resetLink = `${process.env.WEB_DOMAIN}/reset-password/confirm?token=${token}`;

    const html = await this.renderTemplate("reset-password", {
      resetLink,
    });

    await sendEmail({
      to: email,
      subject: "Reset Password",
      html,
    });
  }
}
