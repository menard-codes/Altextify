import { type FetchResponseBody } from "@shopify/admin-api-client";
import type { GetProductIdsQuery } from "app/types/admin.generated";
import { MediaImage } from "app/types/admin.types";
import { AIService } from "common/ai/ai.service";
import { GeminiAdapter } from "common/ai/gemini.adapter";
import {
  getProductIds,
  GetProductIdsParams,
} from "graphql/queries/get-product-ids.server";
import { getProductImages } from "graphql/queries/get-product-images.server";
import { getShopInfo } from "graphql/queries/get-shop.server";

export class AIAltTextGeneratorService {
  /**
   * A bulk process that queries all the products in scope,
   * fetches their images (both its own and its variants),
   * then generate alt texts for each of those images with
   * the product context.
   * @param {GetProductIdsParams} getProductIdsParams
   */
  async productImagesBulkAltGenerate(getProductIdsParams: GetProductIdsParams) {
    const shopInfoResponse = await getShopInfo(getProductIdsParams.gql);
    const shopInfo = await shopInfoResponse.json();

    let paginatedProductIds: FetchResponseBody<GetProductIdsQuery>;
    const imgsWithGeneratedAltText: { id: string; altText: string }[] = [];

    do {
      // query the product ids
      const productIdsResponse = await getProductIds(getProductIdsParams);
      paginatedProductIds = await productIdsResponse.json();

      // query the images of the product, then generate alt texts
      for (const { node } of paginatedProductIds.data!.products.edges) {
        const productImagesResponse = await getProductImages({
          gql: getProductIdsParams.gql,
          params: { id: node.id },
        });
        const { data } = await productImagesResponse.json();

        // flatten data (variants media & product media)
        const product = data?.product;
        const variants = product?.variants.edges.map(({ node }) => ({
          ...node,
          media: node.media.edges.map(({ node: { id } }) => id),
        }));
        const productMedia =
          product?.media.edges.map(({ node }) => ({
            ...node,
          })) ?? [];

        // generate alt texts
        for (const { id, mediaContentType, preview } of productMedia) {
          if (mediaContentType !== "IMAGE") return;

          // finds the variant context of the image (if it has), otherwise, undefined
          const variantContext = variants?.find((variant) =>
            variant.media.includes(id),
          );

          imgsWithGeneratedAltText.push({
            id,
            altText: await this.productImageAltGenerate({
              mimeType: (node as Pick<MediaImage, "mimeType">)
                .mimeType as string,
              url: preview?.image?.url,
              productContext: {
                title: product?.title || "",
                description: product?.descriptionHtml,
                shop: (shopInfo.data?.shop as string | undefined) || "",
                variant: variantContext
                  ? variantContext.selectedOptions
                  : undefined,
              },
            }),
          });
        }
      }
    } while (paginatedProductIds.data?.products.pageInfo.hasNextPage);

    return imgsWithGeneratedAltText;
  }

  /**
   * Generates an alt text for the provided product image.
   * Uses the provided product context in generating the Alt Text
   * @param productImageParams
   * @returns
   */
  async productImageAltGenerate({
    mimeType,
    url,
    productContext,
  }: {
    url: string;
    mimeType: string;
    productContext: {
      title: string;
      description: string;
      shop: string;
      variant?: {
        name: string;
        value: string;
      }[];
    };
  }) {
    const imgBase64 = await this.fetchImageAsBase64(url);

    const geminiAdapter = new GeminiAdapter();
    const aiService = new AIService(geminiAdapter);

    return await aiService.generateText({
      model: "gemini-2.5-flash-lite",
      media: [
        {
          mimeType,
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
              productContext?.variant
                ? `
            <product-variants about="all the product variants associated with this image">
                ${productContext.variant?.map(
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

  private async fetchImageAsBase64(url: string) {
    const imgUrl = url;
    const fetchedImage = await fetch(imgUrl);
    const imgBuffer = await fetchedImage.arrayBuffer();
    return Buffer.from(imgBuffer).toString("base64");
  }
}
