import { type FetchResponseBody } from "@shopify/admin-api-client";
import type { GetProductIdsQuery } from "app/types/admin.generated";
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

export class AIAltTextGeneratorService {
  /**
   * A bulk process that queries all the products in scope,
   * fetches their images, then generate alt texts for each of those images.
   * @param {GetProductIdsParams} getProductIdsParams
   */
  async bulkGenerateProductImageAltTexts(
    getProductIdsParams: GetProductIdsParams,
  ) {
    let paginatedProductIds: FetchResponseBody<GetProductIdsQuery>;
    let imgsWithGeneratedAltText: { id: string; altText: string }[] = [];

    do {
      const productIdsResponse = await getProductIds(getProductIdsParams);
      paginatedProductIds = await productIdsResponse.json();

      // Get all the images associated for each product and generate an alt text for them
      for (const { node } of paginatedProductIds.data!.products.edges) {
        const productImagesWithGeneratedAltTexts =
          await this.generateProductImageAltTexts({
            gql: getProductIdsParams.gql,
            params: {
              id: node.id,
            },
          });

        imgsWithGeneratedAltText = [
          ...imgsWithGeneratedAltText,
          ...productImagesWithGeneratedAltTexts,
        ];
      }
    } while (paginatedProductIds.data?.products.pageInfo.hasNextPage);

    return imgsWithGeneratedAltText;
  }

  /**
   * Fetches all the images related to the given product and generates alt texts
   * for each of those images using the product context. Variant images gets an
   * additional context.
   * @param {GetProductImagesParams} getProductImagesParams
   * @returns
   */
  async generateProductImageAltTexts(
    getProductImagesParams: GetProductImagesParams,
  ) {
    const shopInfoResponse = await getShopInfo(getProductImagesParams.gql);
    const shopInfo = await shopInfoResponse.json();

    const productImagesResponse = await getProductImages(
      getProductImagesParams,
    );
    const { data } = await productImagesResponse.json();

    // flatten data (variants media & product media)
    const product = data?.product;
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
    const imgsWithGeneratedAltText: { id: string; altText: string }[] = [];

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
          shop: shopInfo.data?.shop.name ?? "",
          variant: variantContext ? variantContext.selectedOptions : undefined,
        },
      });

      imgsWithGeneratedAltText.push({
        id: productMedia.id,
        altText: generatedAltText,
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
