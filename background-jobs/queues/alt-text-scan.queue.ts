import { connection } from "background-jobs/connection";
import { ALT_TEXT_SCAN } from "background-jobs/constants/queue-names";
import { AltTextScan } from "background-jobs/workers/alt-text-scan.worker";
import { Job, Queue } from "bullmq";

export const altTextScanQueue = new Queue<Job<AltTextScan>>(ALT_TEXT_SCAN, {
  connection,
});
