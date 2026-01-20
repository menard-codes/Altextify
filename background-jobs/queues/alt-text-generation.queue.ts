import { Queue } from "bullmq";
import { BULK_ALT_TEXT_GENERATION } from "../constants/queue-names";
import { connection } from "../connection";

export const bulkAltTextGenQueue = new Queue(BULK_ALT_TEXT_GENERATION, {
  connection,
});
