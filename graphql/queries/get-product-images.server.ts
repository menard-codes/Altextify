export type GetProductImagesParams = { productId: string };

export const getProductImages = `#graphql
    query getProductImages(
        $productId: ID!
    ) {
        product(id: $productId) {
            id
            title
            descriptionHtml
            # Assuming that, realistically, all stores will not exceed
            # the maximum number of variants: 250 (no pagination intended for this use case)
            hasOnlyDefaultVariant
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
                                    alt
                                }
                            }
                        }
                    }
                }
            }
            # Assuming a product won't exceed 250 media files associated with it
            media(
                first: 250,
                query: "media_type=IMAGE"
            ) {
                edges {
                    node {
                        id
                        alt
                        mediaContentType
                        ... on MediaImage {
                            mimeType
                        }
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
`;
