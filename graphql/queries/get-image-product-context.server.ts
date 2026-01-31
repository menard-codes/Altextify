export type GetImageProductContextParams = { productId: string };

export const getImageProductContext = `#graphql
    query getImageProductContext($productId: ID!) {
        product(id: $productId) {
            title
            descriptionHtml
        }
    }
`;
