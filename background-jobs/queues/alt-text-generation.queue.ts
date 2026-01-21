import { type Job, Queue } from "bullmq";
import { BULK_ALT_TEXT_GENERATION } from "../constants/queue-names";
import { connection } from "../connection";
import { BulkAltTextGenJobData } from "background-jobs/workers/bulk-alt-text-gen.worker";

export const bulkAltTextGenQueue = new Queue<Job<BulkAltTextGenJobData>>(
  BULK_ALT_TEXT_GENERATION,
  {
    connection,
  },
);
