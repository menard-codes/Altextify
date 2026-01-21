export type SendMailParams = {
  subject: string;
  sendTo: string[];
  cc?: string[];
  bcc?: string[];
  body: string;
};

export interface IMailer {
  sendMail(params: SendMailParams): Promise<void>;
}
