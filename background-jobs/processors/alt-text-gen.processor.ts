import { type Job } from "bullmq";
import { AIAltTextGeneratorService } from "common/ai-alt-text-generator/ai-alt-text-generator.service";
import {
  bulkUpdateImageAlt,
  BulkUpdateImageAltParams,
} from "graphql/mutations/bulk-update-image-alt.server";
import { shopifyGQLClientFactory } from "lib/shopify/shopify-gql-client.server";
import { sleep } from "utils/utils";

export class AltTextGenProcessor {
  async bulkUpdateImageAltTexts({
    aiAltTextGeneratorService,
    job,
  }: {
    aiAltTextGeneratorService: AIAltTextGeneratorService;
    // TODO: Might add more depending on the requirements for Node.js session
    job: Job<{ shop: string }>;
  }) {
    const shop = job.data.shop;

    const generatedAltTexts =
      await aiAltTextGeneratorService.bulkGenerateProductImageAltTexts({
        gqlClientFactoryParams: {
          type: "node",
          shop,
        },
      });

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
      // TODO: Check the response of bulk update, especially the errors
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
  }
}
