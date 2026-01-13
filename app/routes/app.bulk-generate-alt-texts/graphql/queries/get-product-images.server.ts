import { AdminOperations } from "@shopify/admin-api-client";
import { GraphQLClient } from "node_modules/@shopify/shopify-app-react-router/dist/ts/server/clients/types";

type GetProductImagesParams = {
  gql: GraphQLClient<AdminOperations>;
  params: { id: string };
};

export async function getProductImages({
  gql,
  params,
}: GetProductImagesParams) {
  return await gql(
    `
        #graphql
        query getProduct(
            $id: ID!
        ) {
            product(id: $id) {
                id
                title
                descriptionHtml
                hasOnlyDefaultVariant
                # Assuming that, realistically, all stores will not exceed
                # the maximum number of variants: 250 (no pagination intended for this use case)
                variants(first: 250) {
                    edges {
                        node {
                            id
                            selectedOptions {
                                name
                                value
                            }
                            # same with this one
                            media(first: 250) {
                                edges {
                                    node {
                                        id
                                    }
                                }
                            }
                        }
                    }
                }
                # Assuming a product won't exceed 250 media files associated with it
                media(
                    first: 250,
                    query: "query: media_type=IMAGE"
                ) {
                    edges {
                        node {
                            id
                            preview {
                                image {
                                    url
                                }
                            }
                        }
                    }
                }
            }
        }
    `,
    { variables: params },
  );
}
