import { connection } from "background-jobs/connection";
import { MAILER } from "background-jobs/constants/queue-names";
import { NotificationMailerProcessor } from "background-jobs/processors/notification-mailer.processor";
import { Job, Worker } from "bullmq";
import { SendMailParams } from "common/mailer/strategies/IMailer";

export enum MailerType {
  SUCCESS_BULK_ALT_GEN = "success-bulk-alt-gen",
  FAILED_BULK_ALT_GEN = "failed-bulk-alt-gen",
}

type MailParams = {
  shop: string;
};

export type SuccessBulkAltGenMailParams = MailParams & {
  type: MailerType.SUCCESS_BULK_ALT_GEN;
  mailerParams: Pick<SendMailParams, "sendTo" | "cc" | "bcc">;
};

export type FailedBulkAltGenMailParams = MailParams & {
  type: MailerType.FAILED_BULK_ALT_GEN;
  mailerParams: Pick<SendMailParams, "sendTo" | "cc" | "bcc">;
};

type MailerParamsUnionType =
  | SuccessBulkAltGenMailParams
  | FailedBulkAltGenMailParams;

export const mailerWorker = new Worker(
  MAILER,
  async ({ data }: Job<MailerParamsUnionType>) => {
    const notifMailerProcessor = new NotificationMailerProcessor();

    const type = data.type;
    switch (type) {
      case MailerType.SUCCESS_BULK_ALT_GEN: {
        notifMailerProcessor.sendJobSuccess({
          shop: data.shop,
          mailerParams: data.mailerParams,
        });
        break;
      }
      case MailerType.FAILED_BULK_ALT_GEN: {
        notifMailerProcessor.sendJobFailed({
          shop: data.shop,
          mailerParams: data.mailerParams,
        });
        break;
      }
      default: {
        throw new Error(`Invalid Mailer Type: ${type}`);
      }
    }
  },
  { connection },
);

// ####################
// Queue Events

// TODO: Use QueueEvents

mailerWorker.on("ready", () => {
  console.log(`${MAILER}: Worker is ready and waiting for jobs`);
});

mailerWorker.on("active", (job) => {
  console.log(`${MAILER}: Processing job ${job.id}`);
});

mailerWorker.on("completed", (job: Job<{ shop: string }>) => {
  console.log(`${MAILER}: Job ${job.id} completed`);
});

mailerWorker.on("failed", (job, err) => {
  console.log(`${MAILER}: Job ${job?.id} failed:`, err);
});

mailerWorker.on("error", (err) => {
  console.error(`${MAILER}: Worker error:`, err);
});
