import type {
  GetProductIdsQuery,
  GetProductImagesQuery,
  GetShopInfoQuery,
} from "app/types/admin.generated";
import { MediaImage } from "app/types/admin.types";
import { AIService } from "common/ai/ai.service";
import { GeminiAdapter } from "common/ai/gemini.adapter";
import {
  getProductIds,
  GetProductIdsParams,
} from "graphql/queries/get-product-ids.server";
import {
  getProductImages,
  GetProductImagesParams,
} from "graphql/queries/get-product-images.server";
import { getShopInfo } from "graphql/queries/get-shop.server";
import { ShopifyGQLClientFatoryParams } from "lib/shopify/shopify-gql-client.server";
import { runQuery } from "lib/shopify/run-query.server";

export class AIAltTextGeneratorService {
  /**
   * A bulk process that queries all the products in scope,
   * fetches their images, then generate alt texts for each of those images.
   * @param {GetProductIdsParams} getProductIdsParams
   */
  async bulkGenerateProductImageAltTexts({
    getProductIdsParams,
    gqlClientFactoryParams,
  }: {
    getProductIdsParams?: GetProductIdsParams;
    gqlClientFactoryParams: ShopifyGQLClientFatoryParams;
  }) {
    let imgsWithGeneratedAltText: { id: string; alt: string }[] = [];
    const pagination: GetProductIdsParams = getProductIdsParams ?? {
      first: 50,
    };

    let paginatedProductIds: GetProductIdsQuery | undefined = undefined;

    do {
      paginatedProductIds = await runQuery<GetProductIdsQuery>({
        gqlClientParams: gqlClientFactoryParams,
        query: getProductIds,
        variables: pagination,
      });

      if (
        !paginatedProductIds ||
        paginatedProductIds.products.edges.length === 0
      ) {
        // TODO: Better logger
        console.info("No product/s found");
        return imgsWithGeneratedAltText;
      }

      // Get all the images associated for each product and generate an alt text for them
      for (const { node } of paginatedProductIds.products.edges) {
        const productImagesWithGeneratedAltTexts =
          await this.generateProductImageAltTexts({
            gqlClientFactoryParams,
            getProductImagesParams: {
              productId: node.id,
            },
          });

        imgsWithGeneratedAltText = [
          ...imgsWithGeneratedAltText,
          ...productImagesWithGeneratedAltTexts,
        ];
      }

      // adjust pagination
      pagination.after = paginatedProductIds.products.pageInfo
        .endCursor as string;
    } while (paginatedProductIds?.products.pageInfo.hasNextPage);

    return imgsWithGeneratedAltText;
  }

  /**
   * Fetches all the images related to the given product and generates alt texts
   * for each of those images using the product context. Variant images gets an
   * additional context.
   * @param {GetProductImagesParams} getProductImagesParams
   * @returns
   */
  async generateProductImageAltTexts({
    getProductImagesParams,
    gqlClientFactoryParams,
  }: {
    getProductImagesParams: GetProductImagesParams;
    gqlClientFactoryParams: ShopifyGQLClientFatoryParams;
  }) {
    const shopInfo = await runQuery<GetShopInfoQuery>({
      gqlClientParams: gqlClientFactoryParams,
      query: getShopInfo,
    });

    const productImagesData = await runQuery<GetProductImagesQuery>({
      gqlClientParams: gqlClientFactoryParams,
      query: getProductImages,
      variables: getProductImagesParams,
    });

    // flatten data (variants media & product media)
    const product = productImagesData?.product;
    const variants = product?.variants.edges.map(({ node }) => ({
      ...node,
      media: node.media.edges.map(({ node: { id } }) => id),
    }));
    const productMediaArray =
      product?.media.edges.map(({ node }) => ({
        ...node,
      })) ?? [];

    // This will contain the product images and their generated alt texts,
    // and will be return by this method
    const imgsWithGeneratedAltText: { id: string; alt: string }[] = [];

    // generate alt texts for all its images
    for (const productMedia of productMediaArray) {
      if (productMedia.mediaContentType !== "IMAGE") continue;

      // finds the variant context of the image (if it has), otherwise, undefined
      const variantContext = variants?.find((variant) =>
        variant.media.includes(productMedia.id),
      );

      const generatedAltText = await this._generateProductImageAlt({
        url: productMedia.preview?.image?.url,
        mimeType: (productMedia as Pick<MediaImage, "mimeType">)
          .mimeType as string,
        productContext: {
          title: product?.title ?? "",
          description: product?.descriptionHtml,
          shop: shopInfo?.shop.name ?? "",
          variant: variantContext ? variantContext.selectedOptions : undefined,
        },
      });

      imgsWithGeneratedAltText.push({
        id: productMedia.id,
        alt: generatedAltText,
      });
    }

    return imgsWithGeneratedAltText;
  }

  /**
   * Generates an alt text for the given product image
   * @param params
   */
  private async _generateProductImageAlt({
    url,
    mimeType,
    productContext,
  }: {
    url: string;
    mimeType: string;
    productContext: {
      title: string;
      description: string;
      shop: string;
      variant?: { name: string; value: string }[];
    };
  }) {
    const imgBase64 = await this._fetchImageAsBase64(url);

    const geminiAdapter = new GeminiAdapter();
    const aiService = new AIService(geminiAdapter);

    return await aiService.generateText({
      model: "gemini-2.5-flash-lite",
      media: [
        {
          mimeType: mimeType,
          base64: imgBase64,
        },
      ],
      prompt: `
        <task>
            This is a product image for the e-commerce shop "${productContext.shop}".
            Generate a WCAG-compliant alt text for it.
            Make sure to use the <product-context> provided.
            Generate the alt text in plain text, DON'T wrap it in any XML tags like "<alt-text>"
            or something similar. AVOID any special characters unless necessary.
        </task>
        <product-context>
            <product-name>${productContext.title}</product-name>
            <product-description>${productContext.description}</product-description>
            ${
              productContext.variant
                ? `
            <product-variants about="all the product variants associated with this image">
                ${productContext.variant.map(
                  ({ name, value }) =>
                    `<variant name="${name}" value="${value}">`,
                )}
            </product-variants>`
                : ""
            }
        </product-context>
      `,
      systemPrompt: `
        You are an accessibility and technical SEO expert.
        Your main objective is to generate alt text for the attached image as specified in the <task>.
        Use the provided <product-context> for generating the Alt text.
        Make sure the Alt text is WCAG compliant and SEO-friendly.
       `,
    });
  }

  /**
   * Fetches the image from the given url and returns it as base 64 buffer
   * @param {string} url
   * @returns
   */
  private async _fetchImageAsBase64(url: string) {
    const imgUrl = url;
    const fetchedImage = await fetch(imgUrl);
    const imgBuffer = await fetchedImage.arrayBuffer();
    return Buffer.from(imgBuffer).toString("base64");
  }
}
