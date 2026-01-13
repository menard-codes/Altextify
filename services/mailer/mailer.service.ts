import { IMailer, SendMailParams } from "./strategies/IMailer";

export class MailerService {
  constructor(private mailer: IMailer) {}

  async sendMail(params: SendMailParams) {
    // TODO: Handle errors
    await this.mailer.sendMail(params);
  }
}
