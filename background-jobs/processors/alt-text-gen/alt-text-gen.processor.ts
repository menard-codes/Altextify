import { type Job } from "bullmq";
import { AIAltTextGeneratorService } from "common/ai-alt-text-generator/ai-alt-text-generator.service";
import {
  bulkUpdateImageAlt,
  BulkUpdateImageAltParams,
} from "graphql/mutations/bulk-update-image-alt.server";
import { shopifyGQLClientFactory } from "lib/shopify/shopify-gql-client.server";
import { sleep } from "utils/utils";
import { BulkUpdateImageAltTextsProgress } from "./types";
import prisma from "app/db.server";
import { Prisma } from "@prisma/client";

export class AltTextGenProcessor {
  async bulkUpdateImageAltTexts({
    aiAltTextGeneratorService,
    job,
  }: {
    aiAltTextGeneratorService: AIAltTextGeneratorService;
    job: Job<{ shop: string }>;
  }) {
    const jobProgress: BulkUpdateImageAltTextsProgress = {
      1: {
        stepName: "Generating AI Alt Texts (in bulk)",
        status: "Pending",
      },
      2: {
        stepName: "Saving AI Generated Alt Texts",
        status: "Pending",
      },
    };

    const shop = job.data.shop;

    // #################
    // # Step 1: Alt Text AI Generation (in bulk)
    jobProgress[1].status = "In Progress";
    job.updateProgress(jobProgress);

    let generatedAltTexts: Awaited<
      ReturnType<AIAltTextGeneratorService["bulkGenerateProductImageAltTexts"]>
    >;

    try {
      generatedAltTexts =
        await aiAltTextGeneratorService.bulkGenerateProductImageAltTexts({
          gqlClientFactoryParams: {
            type: "node",
            shop,
          },
        });
      jobProgress[1].status = "Completed";
      job.updateProgress(jobProgress);
    } catch (error) {
      jobProgress[1].status = "Failed";
      job.updateProgress(jobProgress);
      // re-throw error
      throw error;
    }
    // #################

    // #################
    // Step 2: Bulk Update image alt texts
    jobProgress[2].status = "In Progress";
    job.updateProgress(jobProgress);

    try {
      // Save to database first
      await prisma.generatedAltText.createMany({
        data: generatedAltTexts.map(
          ({ id, alt }) =>
            ({
              jobId: job.id as string,
              imageId: id,
              altText: alt,
            }) as Prisma.GeneratedAltTextCreateManyInput,
        ),
      });

      // TODO: Improvement - allow users to configure if they want to auto-save
      // Bulk update the alt text of images from generatedAltTexts using the admin API
      const client = await shopifyGQLClientFactory({
        type: "node",
        shop,
      });

      const pageSize = 25;
      let i = 0;
      let j = pageSize;
      while (i <= generatedAltTexts.length - 1) {
        const arraySlice = generatedAltTexts.slice(i, j);
        await client.request(bulkUpdateImageAlt, {
          variables: {
            images: arraySlice,
          } as BulkUpdateImageAltParams,
        });

        // Halt for 5s to avoid throttling
        await sleep(5000);

        i = j;
        j += pageSize;
      }
      jobProgress[2].status = "Completed";
      job.updateProgress(jobProgress);
    } catch (error) {
      jobProgress[2].status = "Failed";
      job.updateProgress(jobProgress);

      // re-throw data
      throw error;
    }
  }
}
