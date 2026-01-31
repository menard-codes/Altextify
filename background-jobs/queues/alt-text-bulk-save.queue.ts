import { connection } from "background-jobs/connection";
import { BULK_SAVE_ALT_TEXTS } from "background-jobs/constants/queue-names";
import { BulkSaveAltTextsJobData } from "background-jobs/workers/bulk-save-alt-texts.worker";
import { Job, Queue } from "bullmq";

export const altTextBulkSaveQueue = new Queue<Job<BulkSaveAltTextsJobData>>(
  BULK_SAVE_ALT_TEXTS,
  {
    connection,
  },
);
