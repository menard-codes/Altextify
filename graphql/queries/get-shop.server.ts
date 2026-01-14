import { AdminOperations } from "@shopify/admin-api-client";
import { GraphQLClient } from "node_modules/@shopify/shopify-app-react-router/dist/ts/server/clients/types";

export async function getShopInfo(gql: GraphQLClient<AdminOperations>) {
  return await gql(
    `#graphql
        query getShopInfo {
            shop {
                email
                name
            }
        }`,
  );
}
