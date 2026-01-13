import { AdminOperations } from "@shopify/admin-api-client";
import { type FileUpdateInput } from "app/types/admin.types";
import { GraphQLClient } from "node_modules/@shopify/shopify-app-react-router/dist/ts/server/clients/types";

type BulkUpdateImageAltParams = {
  gql: GraphQLClient<AdminOperations>;
  params: {
    images: Pick<FileUpdateInput, "id" | "alt">[];
  };
};

export async function bulkUpdateImageAlt({
  gql,
  params,
}: BulkUpdateImageAltParams) {
  return await gql(
    `
        #graphql
        mutation bulkUpdateImageAlt($images: [FileUpdateInput!]!) {
            fileUpdate(files: $images) {
                files {
                    id
                    alt
                }
                userErrors {
                    field
                    message
                }
            }
        }
    `,
    { variables: params },
  );
}
