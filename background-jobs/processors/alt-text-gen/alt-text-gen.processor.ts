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
import { $Enums, Prisma } from "@prisma/client";
import { BulkAltTextGenJobData } from "background-jobs/workers/bulk-alt-text-gen.worker";
import { runQuery } from "lib/shopify/run-query.server";
import { BulkUpdateImageAltMutation } from "app/types/admin.generated";

export class AltTextGenProcessor {
  async bulkUpdateImageAltTexts({
    aiAltTextGeneratorService,
    job,
  }: {
    aiAltTextGeneratorService: AIAltTextGeneratorService;
    job: Job<BulkAltTextGenJobData>;
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
    const jobInfo = await prisma.job.findFirst({
      where: {
        id: job.id,
      },
    });

    if (!jobInfo) {
      // TODO: Better logger
      throw new Error(`Job "${job.id}" was not found`);
    }

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
          getProductIdsParams: {
            search: this._convertScopeToShopifyQuery(
              jobInfo.scope,
              jobInfo.scopeIdentifiers,
            ),
          },
          onlyGenerateMissingAlt: jobInfo.onlyGenerateMissingAlt,
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
    try {
      // Save to database first
      await prisma.generatedAltText.createMany({
        data: generatedAltTexts.map(
          ({
            id,
            generatedAltText,
            originalAltText,
            url,
            variantId,
            productId,
            productName,
          }) =>
            ({
              jobId: job.id as string,
              imageId: id,
              url,
              generatedAltText,
              originalAltText,
              productId,
              productName,
              variantId,
            }) as Prisma.GeneratedAltTextCreateManyInput,
        ),
      });

      // Skip if auto-save is off
      if (!jobInfo.autoSave) return;

      jobProgress[2].status = "In Progress";
      job.updateProgress(jobProgress);

      // Bulk update the alt text of images from generatedAltTexts using the admin API
      const client = await shopifyGQLClientFactory({
        type: "node",
        shop,
      });

      const pageSize = 25;
      let i = 0;
      let j = pageSize;
      while (i <= generatedAltTexts.length - 1) {
        const arraySlice = generatedAltTexts
          .slice(i, j)
          .map(({ id, generatedAltText }) => ({ id, alt: generatedAltText }));
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

  private _convertScopeToShopifyQuery(
    scope: $Enums.JobScope,
    scopeIdentifiers: string[],
  ) {
    switch (scope) {
      case "allProducts": {
        return "";
      }
      case "selectedCollections": {
        return scopeIdentifiers
          .map((colId) => `collection_id:${colId}`)
          .join(" OR ");
      }
      case "selectedProducts": {
        return `handle:${scopeIdentifiers.join(",")}`;
      }
    }
  }

  async bulkSaveAltTexts({
    altTextGenJobId,
    shop,
  }: {
    altTextGenJobId: string;
    shop: string;
  }) {
    const generatedAltTextsCount = await prisma.generatedAltText.count({
      where: {
        jobId: altTextGenJobId,
      },
    });

    let page = 1;
    const take = 50;

    while ((page - 1) * take < generatedAltTextsCount) {
      const skip = (page - 1) * take;

      const generatedAltTexts = await prisma.generatedAltText.findMany({
        where: {
          jobId: altTextGenJobId,
        },
        take,
        skip,
      });

      const bulkUpdateImageAltParams: BulkUpdateImageAltParams = {
        images: generatedAltTexts.map(({ imageId, generatedAltText }) => ({
          id: imageId,
          alt: generatedAltText,
        })),
      };

      const res = await runQuery<BulkUpdateImageAltMutation>({
        gqlClientParams: {
          type: "node",
          shop,
        },
        query: bulkUpdateImageAlt,
        variables: bulkUpdateImageAltParams,
      });
      if (res?.fileUpdate?.userErrors) {
        console.error(res.fileUpdate.userErrors);
      }

      page += 1;

      // Sleep for 3s to avoid throttling
      await sleep(3000);
    }
  }
}
