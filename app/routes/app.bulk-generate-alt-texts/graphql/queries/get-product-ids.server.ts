import { AdminOperations } from "@shopify/admin-api-client";
import { GraphQLClient } from "node_modules/@shopify/shopify-app-react-router/dist/ts/server/clients/types";

type GetProductIdsParams = {
  gql: GraphQLClient<AdminOperations>;
  params: {
    first?: number;
    last?: number;
    before?: string;
    after?: string;
    search?: string;
  };
};

export async function getProductIds({ gql, params }: GetProductIdsParams) {
  return await gql(
    `
        #graphql
        query getProductIds(
            $first: Int
            $last: Int
            $before: String
            $after: String
            $search: String
        ) {
            products(
                first: $first
                last: $last
                before: $before
                after: $after
                query: $search
            ) {
                edges {
                    node {
                        id
                    }
                }
                pageInfo {
                    startCursor
                    hasNextPage
                    endCursor
                    hasPreviousPage
                }
            }
        }
    `,
    {
      variables: params,
    },
  );
}
