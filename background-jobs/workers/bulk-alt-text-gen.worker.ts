import { type Job, Worker } from "bullmq";
import { BULK_ALT_TEXT_GENERATION, MAILER } from "../constants/queue-names";
import { AltTextGenProcessor } from "../processors/alt-text-gen.processor";
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

export const bulkAltTextGenWorker = new Worker(
  BULK_ALT_TEXT_GENERATION,
  async (job: Job<{ shop: string }>) => {
    const altTextGenProcessor = new AltTextGenProcessor();
    await altTextGenProcessor.bulkUpdateImageAltTexts({
      job,
      aiAltTextGeneratorService: new AIAltTextGeneratorService(),
    });
  },
  { connection },
);

// ####################
// Queue Events

// TODO: Use QueueEvents

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
