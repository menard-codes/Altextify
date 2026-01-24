import { connection } from "background-jobs/connection";
import { ALT_TEXT_SCAN } from "background-jobs/constants/queue-names";
import { ReportsService } from "background-jobs/processors/reports/reports.service";
import { type Job, Worker } from "bullmq";

export type AltTextScan = { shop: string };

export const altTextScanWorker = new Worker(
  ALT_TEXT_SCAN,
  async (job: Job<AltTextScan>) => {
    const reportsService = new ReportsService();
    await reportsService.scanImageAltTexts(job.data.shop);
  },
  {
    connection,
  },
);

export const getScanJobId = (shop: string) => `scan__${shop}`;

// ####################
// Worker Events

altTextScanWorker.on("ready", () => {
  console.log(`${ALT_TEXT_SCAN}: Worker is ready and waiting for jobs`);
});

altTextScanWorker.on("active", (job) => {
  console.log(`${ALT_TEXT_SCAN}: Processing job ${job.id}`);
});

altTextScanWorker.on("completed", async (job) => {
  console.log(`${ALT_TEXT_SCAN}: Job ${job.id} completed`);
});

altTextScanWorker.on("failed", async (job, err) => {
  console.log(`${ALT_TEXT_SCAN}: Job ${job?.id} failed:`, err);
});

altTextScanWorker.on("error", (err) => {
  console.error(`${ALT_TEXT_SCAN}: Worker error:`, err);
});
