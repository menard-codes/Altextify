import { ScanReport } from "@prisma/client";
import prisma from "app/db.server";
import { GetShopImagesQuery } from "app/types/admin.generated";
import {
  getShopImages,
  GetShopImagesParams,
} from "graphql/queries/get-shop-images.server";
import { runQuery } from "lib/shopify/run-query.server";
import { sleep } from "utils/utils";

export class ReportsService {
  /**
   * Scans and checks the shop's images and their alt texts.
   * The scan results are saved in the ScanReport table.
   * If the shop already has a scan record, it returns it.
   * @param shop The shop to scan
   */
  async scanImageAltTexts(shop: string): Promise<ScanReport> {
    let totalImages = 0;
    let imagesWithAltText = 0;

    // using admin api, query the images (use pagination)
    const PAGE_SIZE = 50;
    let hasNext = true;
    let startCursor: string | undefined = undefined;

    while (hasNext) {
      const getShopImagesParams: GetShopImagesParams = {
        first: PAGE_SIZE,
        after: startCursor,
      };
      const shopImages = await runQuery<GetShopImagesQuery>({
        gqlClientParams: {
          type: "node",
          shop,
        },
        query: getShopImages,
        variables: getShopImagesParams,
      });

      if (!shopImages) {
        throw new Error("Shop images query didn't return anything.");
      }

      // record status (in memory for now)
      totalImages += shopImages.files.edges.length;
      imagesWithAltText += shopImages.files.edges.filter(
        ({ node: { alt } }) => !!alt,
      ).length;

      const pageInfo = shopImages.files.pageInfo;
      hasNext = pageInfo.hasNextPage;
      startCursor = pageInfo.startCursor as string | undefined;

      await sleep(5000);
    }

    // save to database and return scan object
    return await prisma.scanReport.upsert({
      where: { shop },
      update: {
        totalImages,
        imagesWithAltText,
        lastScan: new Date(),
      },
      create: {
        shop,
        totalImages,
        imagesWithAltText,
      },
    });
  }
}
