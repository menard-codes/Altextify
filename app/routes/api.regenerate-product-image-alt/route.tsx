import { ActionFunctionArgs, data } from "react-router";
import { ProductImageAltGenSchema } from "./ProductImageAltGenSchema";
import { z } from "zod";
import { HttpResponse } from "types/http-response.type";
import { AIAltTextGeneratorService } from "common/ai-alt-text-generator/ai-alt-text-generator.service";
import { bulkUpdateImageAlt } from "graphql/mutations/bulk-update-image-alt.server";
import prisma from "app/db.server";
import { authenticate } from "app/shopify.server";
import {
  GetMediaImage,
  getMediaImage,
  getMediaImageQuery,
} from "graphql/queries/get-media-image.server";
import { runQuery } from "lib/shopify/run-query.server";
import {
  GetImageProductContextQuery,
  GetImageVariantContextQuery,
  GetMediaImageQuery,
} from "app/types/admin.generated";
import {
  getImageProductContext,
  GetImageProductContextParams,
} from "graphql/queries/get-image-product-context.server";
import {
  GetImageVariantContext,
  getImageVariantContext,
} from "graphql/queries/get-image-variant-context.server";
import { SelectedOption } from "app/types/admin.types";

export async function action({ request }: ActionFunctionArgs) {
  const { session, admin } = await authenticate.admin(request);

  const method = request.method.toUpperCase();
  if (method !== "POST") {
    return data({ message: "Method not allowed" }, { status: 405 });
  }

  const rawBody = await request.json();
  const parsedBody = ProductImageAltGenSchema.safeParse(rawBody);

  if (parsedBody.error) {
    const errorDetails = z.treeifyError(parsedBody.error);
    return data(
      {
        type: "error",
        details: errorDetails,
      } as HttpResponse<undefined, typeof errorDetails>,
      { status: 400 },
    );
  }

  const generatedAltTextEntry = await prisma.generatedAltText.findFirst({
    where: { id: parsedBody.data.generatedAltTextId },
  });

  if (!generatedAltTextEntry) {
    const errorDetail = {
      message: `Generated alt "${parsedBody.data.generatedAltTextId}" was not found`,
    };
    return data(
      {
        type: "error",
        details: errorDetail,
      } as HttpResponse<undefined, typeof errorDetail>,
      { status: 404 },
    );
  }

  const extractId = (gid: string) => {
    if (!gid.trim() || typeof gid !== "string") return null;

    const parts = gid.split("/");
    const id = parts[parts.length - 1];

    const idRegEx = /^\d+$/;
    const isNumericId = idRegEx.test(id);
    return id && isNumericId ? id : null;
  };

  const { imageId, productId, variantId } = generatedAltTextEntry;

  // - file (imageId): mimeType
  const mediaImage = await runQuery<GetMediaImageQuery>({
    gqlClientParams: {
      type: "react-router",
      request,
    },
    query: getMediaImage,
    variables: {
      fileId: getMediaImageQuery(extractId(imageId) ?? ""),
    } as GetMediaImage,
  });
  const mimeType = mediaImage?.files.edges[0].node.mimeType ?? "";

  // - product (productId): title, descriptionHtml
  const productContext = await runQuery<GetImageProductContextQuery>({
    gqlClientParams: {
      type: "react-router",
      request,
    },
    query: getImageProductContext,
    variables: { productId } as GetImageProductContextParams,
  });
  const product = productContext?.product;
  const productName = product?.title;
  const productDescription = product?.descriptionHtml;

  // - variant (variantId): {name, value}[]
  let selectedOptions: Pick<SelectedOption, "name" | "value">[] | undefined =
    undefined;
  if (variantId) {
    const variantContext = await runQuery<GetImageVariantContextQuery>({
      gqlClientParams: {
        type: "react-router",
        request,
      },
      query: getImageVariantContext,
      variables: { variantId: variantId } as GetImageVariantContext,
    });
    selectedOptions = variantContext?.productVariant?.selectedOptions;
  }

  const aiAltTextGenService = new AIAltTextGeneratorService();
  const generatedAltText = await aiAltTextGenService.generateProductImageAlt({
    url: generatedAltTextEntry.url,
    mimeType,
    productContext: {
      title: productName ?? "",
      description: productDescription,
      shop: session.shop,
      variant: selectedOptions,
    },
  });

  await prisma.generatedAltText.update({
    where: { id: parsedBody.data.generatedAltTextId },
    data: {
      generatedAltText,
    },
  });

  const { autoSave } = parsedBody.data;
  if (autoSave) {
    await admin.graphql(bulkUpdateImageAlt, {
      variables: {
        images: [{ id: generatedAltTextEntry.imageId, alt: generatedAltText }],
      },
    });
  }

  const response = {
    generatedAltText,
  };
  return data({
    type: "success",
    data: response,
  } as HttpResponse<typeof response, undefined>);
}
