import { type Job, Worker } from "bullmq";
import { BULK_ALT_TEXT_GENERATION, MAILER } from "../constants/queue-names";
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
import prisma from "app/db.server";
import { reScan } from "./alt-text-scan.worker";

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

bulkAltTextGenWorker.on("ready", () => {
  console.log(
    `${BULK_ALT_TEXT_GENERATION}: Worker is ready and waiting for jobs`,
  );
});

bulkAltTextGenWorker.on("active", async (job) => {
  console.log(`${BULK_ALT_TEXT_GENERATION}: Processing job ${job.id}`);

  const status = await job.getState();
  await prisma.job.update({
    where: {
      id: job.id,
    },
    data: {
      status: status === "waiting-children" ? "waitingChildren" : status,
      processedOn: job.processedOn ? new Date(job.processedOn) : null,
    },
  });
});

bulkAltTextGenWorker.on("completed", async (job) => {
  console.log(`${BULK_ALT_TEXT_GENERATION}: Job ${job.id} completed`);

  // Re-scan and send notifications

  await reScan(job.data.shop);

  const status = await job.getState();
  await prisma.job.update({
    where: {
      id: job.id,
    },
    data: {
      status: status === "waiting-children" ? "waitingChildren" : status,
      finishedOn: job.finishedOn ? new Date(job.finishedOn) : null,
    },
  });

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

  const status = await job.getState();
  await prisma.job.update({
    where: {
      id: job.id,
    },
    data: {
      status: status === "waiting-children" ? "waitingChildren" : status,
      finishedOn: job.finishedOn ? new Date(job.finishedOn) : null,
    },
  });

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
