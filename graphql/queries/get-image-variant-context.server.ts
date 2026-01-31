export type GetImageVariantContext = { variantId: string };

export const getImageVariantContext = `#graphql
    query getImageVariantContext($variantId: ID!) {
        productVariant(id: $variantId) {
            selectedOptions {
                name
                value
            }
        }
    }
`;
