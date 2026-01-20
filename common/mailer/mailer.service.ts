import { ConsoleLogMailer } from "./strategies/console-log-mailer";
import { IMailer, SendMailParams } from "./strategies/IMailer";

export class MailerService {
  private mailer: IMailer;

  constructor(mailer?: IMailer) {
    // TODO: Change the default mailer
    const defaultMailer = new ConsoleLogMailer();
    this.mailer = mailer ?? defaultMailer;
  }

  async sendMail(params: SendMailParams) {
    await this.mailer.sendMail(params);
  }
}
