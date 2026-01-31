import { GetShopInfoQuery } from "app/types/admin.generated";
import { connection } from "background-jobs/connection";
import {
  BULK_SAVE_ALT_TEXTS,
  MAILER,
} from "background-jobs/constants/queue-names";
import { AltTextGenProcessor } from "background-jobs/processors/alt-text-gen/alt-text-gen.processor";
import { mailerQueue } from "background-jobs/queues/mailer.queue";
import { Job, Worker } from "bullmq";
import { getShopInfo } from "graphql/queries/get-shop.server";
import { runQuery } from "lib/shopify/run-query.server";
import {
  FailedBulkSaveMailParams,
  MailerType,
  SuccessBulkSaveMailParams,
} from "./mailer.worker";
import { reScan } from "./alt-text-scan.worker";

export type BulkSaveAltTextsJobData = {
  altTextGenJobId: string;
  shop: string;
};

export const bulkSaveAltTextsWorker = new Worker(
  BULK_SAVE_ALT_TEXTS,
  async (job: Job<BulkSaveAltTextsJobData>) => {
    const { altTextGenJobId, shop } = job.data;
    const altTextGenProcessor = new AltTextGenProcessor();
    await altTextGenProcessor.bulkSaveAltTexts({
      altTextGenJobId,
      shop,
    });
  },
  { connection },
);

// ####################
// Worker Events

bulkSaveAltTextsWorker.on("ready", () => {
  console.log(`${BULK_SAVE_ALT_TEXTS}: Worker is ready and waiting for jobs`);
});

bulkSaveAltTextsWorker.on("active", async (job) => {
  console.log(`${BULK_SAVE_ALT_TEXTS}: Processing job ${job.id}`);
});

bulkSaveAltTextsWorker.on("completed", async (job) => {
  console.log(`${BULK_SAVE_ALT_TEXTS}: Job ${job.id} completed`);

  await reScan(job.data.shop);

  // send notifications
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
    type: MailerType.SUCCESS_BULK_SAVE,
    shop: shopInfo.shop.name,
    mailerParams: {
      sendTo: [shopInfo.shop.email],
    },
    jobPageURL: `/app/jobs/${job.data.altTextGenJobId}`,
  } as SuccessBulkSaveMailParams);
});

bulkSaveAltTextsWorker.on("failed", async (job, err) => {
  console.log(`${BULK_SAVE_ALT_TEXTS}: Job ${job?.id} failed:`, err);

  if (!job) return;

  await reScan(job.data.shop);

  // send notifications

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
    type: MailerType.FAILED_BULK_SAVE,
    shop: job.data.shop,
    mailerParams: {
      sendTo: [shopInfo.shop.email],
    },
    jobPageURL: `/app/jobs/${job.data.altTextGenJobId}`,
  } as FailedBulkSaveMailParams);
});

bulkSaveAltTextsWorker.on("error", (err) => {
  console.error(`${BULK_SAVE_ALT_TEXTS}: Worker error:`, err);
});
