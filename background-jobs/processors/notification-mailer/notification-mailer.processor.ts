import { MailerService } from "common/mailer/mailer.service";
import { SendMailParams } from "common/mailer/strategies/IMailer";

export class NotificationMailerProcessor {
  sendJobSuccess({
    shop,
    mailerParams: { sendTo, cc, bcc },
  }: {
    shop: string;
    mailerParams: Pick<SendMailParams, "sendTo" | "cc" | "bcc">;
  }) {
    const mailer = new MailerService();
    mailer.sendMail({
      subject: "Altextify: [COMPLETED] Image Alt Texts bulk generation",
      sendTo,
      cc,
      bcc,
      body: `Successfully updated all the alt texts of product images in ${shop}`,
    });
  }

  sendJobFailed({
    shop,
    mailerParams: { sendTo, cc, bcc },
  }: {
    shop: string;
    mailerParams: Pick<SendMailParams, "sendTo" | "cc" | "bcc">;
  }) {
    const mailer = new MailerService();
    mailer.sendMail({
      subject: "Altextify: [FAILED] Image Alt Texts bulk generation",
      sendTo,
      cc,
      bcc,
      body: `
      Failed updating the alt texts of product images in your shop "${shop}".
      We encountered a technical issue and we're already working to fix it.`,
    });
  }
}
