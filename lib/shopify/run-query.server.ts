import { FetchResponseBody } from "@shopify/admin-api-client";
import {
  shopifyGQLClientFactory,
  ShopifyGQLClientFatoryParams,
} from "./shopify-gql-client.server";

export async function runQuery<T>({
  gqlClientParams,
  query,
  variables,
}: {
  gqlClientParams: ShopifyGQLClientFatoryParams;
  query: string;
  variables?: Record<string, unknown>;
}): Promise<T | undefined> {
  switch (gqlClientParams.type) {
    case "node": {
      const client = await shopifyGQLClientFactory(gqlClientParams);
      const res = await client.request<T>(query, { variables });
      return res.data;
    }
    case "react-router": {
      const client = await shopifyGQLClientFactory(gqlClientParams);
      const res = await client(query, { variables });
      const json: FetchResponseBody<T> = await res.json();
      return json.data;
    }
    default: {
      throw new Error("Invalid gql client type");
    }
  }
}
