import prisma from "app/db.server";
import { authenticate } from "app/shopify.server";
import { shopifyNode } from "./shopify-node.server";
import { GraphqlClient, Session } from "@shopify/shopify-api";
import { GraphQLClient } from "node_modules/@shopify/shopify-app-react-router/dist/ts/server/clients/types";
import { AdminOperations } from "@shopify/admin-api-client";

type ReactRouterGQLClientParams = {
  type: "react-router";
  request: Request;
};

type NodeGQLClientParams = {
  type: "node";
  shop: string;
};

export type ShopifyGQLClientFatoryParams =
  | ReactRouterGQLClientParams
  | NodeGQLClientParams;

export async function shopifyGQLClientFactory(
  params: ReactRouterGQLClientParams,
): Promise<GraphQLClient<AdminOperations>>;
export async function shopifyGQLClientFactory(
  params: NodeGQLClientParams,
): Promise<GraphqlClient>;
export async function shopifyGQLClientFactory(
  params: ShopifyGQLClientFatoryParams,
) {
  switch (params.type) {
    case "react-router": {
      const { admin } = await authenticate.admin(params.request);
      return admin.graphql.bind(admin.graphql);
    }
    case "node": {
      const session = await prisma.session.findFirst({
        where: {
          shop: params.shop,
          isOnline: false,
        },
      });

      if (!session) {
        // This should be caught as 401 Unauthorized error
        throw new Error("Session not found.");
      }

      const gqlClient = new shopifyNode.clients.Graphql({
        session: new Session({
          id: session.id,
          shop: session.shop,
          state: session.state,
          isOnline: session.isOnline,
          accessToken: session.accessToken,
          scope: session.scope ?? undefined,
        }),
      });
      return gqlClient;
    }
    default: {
      throw new Error("Unknown GQL client type");
    }
  }
}
