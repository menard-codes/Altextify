import { ApiVersion, shopifyApi } from "@shopify/shopify-api";

export const shopifyNode = shopifyApi({
    apiKey: process.env.SHOPIFY_API_KEY,
    apiSecretKey: process.env.SHOPIFY_API_SECRET ?? '',
    scopes: process.env.SHOPIFY_API_SCOPES?.split(','),
    hostName: process.env.SHOPIFY_API_HOSTNAME ?? '',
    apiVersion: ApiVersion.October25,
    isEmbeddedApp: true,
});
