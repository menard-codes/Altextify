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

  sendBulkSaveSuccess({
    shop,
    mailerParams: { sendTo, cc, bcc },
    jobPageURL,
  }: {
    shop: string;
    mailerParams: Pick<SendMailParams, "sendTo" | "cc" | "bcc">;
    jobPageURL: string;
  }) {
    const mailer = new MailerService();
    mailer.sendMail({
      subject: "Altextify: [SUCCESS] Saved Generated Alt Texts",
      sendTo,
      cc,
      bcc,
      body: `
      Successfully saved the bulk generated alt texts in "${shop}".
      Bulk Alt Text Generation Task page: ${jobPageURL}
      `,
    });
  }

  sendBulkSaveFailed({
    shop,
    mailerParams: { sendTo, cc, bcc },
    jobPageURL,
  }: {
    shop: string;
    mailerParams: Pick<SendMailParams, "sendTo" | "cc" | "bcc">;
    jobPageURL: string;
  }) {
    const mailer = new MailerService();
    mailer.sendMail({
      subject: "Altextify: [FAILED] Failed Saving Generated Alt Texts",
      sendTo,
      cc,
      bcc,
      body: `
      Failed saving all the generated alt texts to your shop "${shop}".
      You can re-try again in the Job Page. If the issue persists, contact us.
      Bulk Alt Text Generation Task page: ${jobPageURL}
      `,
    });
  }
}
