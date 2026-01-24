import { type Job, Worker } from "bullmq";
import {
  ALT_TEXT_SCAN,
  BULK_ALT_TEXT_GENERATION,
  MAILER,
} from "../constants/queue-names";
import { AltTextGenProcessor } from "../processors/alt-text-gen/alt-text-gen.processor";
import { AIAltTextGeneratorService } from "common/ai-alt-text-generator/ai-alt-text-generator.service";
import { connection } from "../connection";
import { mailerQueue } from "background-jobs/queues/mailer.queue";
import {
  FailedBulkAltGenMailParams,
  MailerType,
  SuccessBulkAltGenMailParams,
} from "./mailer.worker";
import { runQuery } from "lib/shopify/run-query.server";
import { getShopInfo } from "graphql/queries/get-shop.server";
import { GetShopInfoQuery } from "app/types/admin.generated";
import { getScanJobId } from "./alt-text-scan.worker";
import { altTextScanQueue } from "background-jobs/queues/alt-text-scan.queue";

export type BulkAltTextGenJobData = { shop: string };

export const bulkAltTextGenWorker = new Worker(
  BULK_ALT_TEXT_GENERATION,
  async (job: Job<BulkAltTextGenJobData>) => {
    const altTextGenProcessor = new AltTextGenProcessor();
    await altTextGenProcessor.bulkUpdateImageAltTexts({
      job,
      aiAltTextGeneratorService: new AIAltTextGeneratorService(),
    });
  },
  { connection },
);

// ####################
// Worker Events

async function reScan(shop: string) {
  const scanJobId = getScanJobId(shop);
  const scanJob = await altTextScanQueue.getJob(scanJobId);
  const status = await scanJob?.getState();
  if (status === "completed" || status === "failed") {
    await scanJob?.remove();
  }
  await altTextScanQueue.add(ALT_TEXT_SCAN, { shop }, { jobId: scanJobId });
}

bulkAltTextGenWorker.on("ready", () => {
  console.log(
    `${BULK_ALT_TEXT_GENERATION}: Worker is ready and waiting for jobs`,
  );
});

bulkAltTextGenWorker.on("active", (job) => {
  console.log(`${BULK_ALT_TEXT_GENERATION}: Processing job ${job.id}`);
});

bulkAltTextGenWorker.on("completed", async (job) => {
  console.log(`${BULK_ALT_TEXT_GENERATION}: Job ${job.id} completed`);

  // Re-scan and send notifications

  await reScan(job.data.shop);

  const shopInfo = await runQuery<GetShopInfoQuery>({
    gqlClientParams: {
      type: "node",
      shop: job.data.shop,
    },
    query: getShopInfo,
  });

  if (!shopInfo) {
    throw new Error(`Shop was not found: ${job.data.shop}`);
  }

  await mailerQueue.add(MAILER, {
    type: MailerType.SUCCESS_BULK_ALT_GEN,
    shop: shopInfo.shop.name,
    mailerParams: {
      sendTo: [shopInfo.shop.email],
    },
  } as SuccessBulkAltGenMailParams);
});

bulkAltTextGenWorker.on("failed", async (job, err) => {
  console.log(`${BULK_ALT_TEXT_GENERATION}: Job ${job?.id} failed:`, err);

  if (!job) return;

  // Re-scan and send notifications

  await reScan(job.data.shop);

  const shopInfo = await runQuery<GetShopInfoQuery>({
    gqlClientParams: {
      type: "node",
      shop: job.data.shop,
    },
    query: getShopInfo,
  });

  if (!shopInfo) {
    throw new Error(`Shop was not found: ${job.data.shop}`);
  }

  await mailerQueue.add(MAILER, {
    type: MailerType.FAILED_BULK_ALT_GEN,
    shop: job.data.shop,
    mailerParams: {
      sendTo: [shopInfo.shop.email],
    },
  } as FailedBulkAltGenMailParams);
});

bulkAltTextGenWorker.on("error", (err) => {
  console.error(`${BULK_ALT_TEXT_GENERATION}: Worker error:`, err);
});
