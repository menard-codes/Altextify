import { connection } from "background-jobs/connection";
import { MAILER } from "background-jobs/constants/queue-names";
import { Queue } from "bullmq";

export const mailerQueue = new Queue(MAILER, {
  connection,
});
