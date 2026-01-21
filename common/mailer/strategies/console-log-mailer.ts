import { IMailer, SendMailParams } from "./IMailer";

export class ConsoleLogMailer implements IMailer {
  async sendMail({ subject, sendTo, cc, bcc, body }: SendMailParams) {
    await new Promise((res) => setTimeout(res, 1000));
    console.log(`
========================================================
Sending Mail...

Subject: ${subject}

Send To: ${sendTo.join(", ")}
Cc: ${cc ? cc.join(", ") : "None"}
Bcc: ${bcc ? bcc.join(", ") : "None"}

Body:
${body}
========================================================
`);
  }
}
