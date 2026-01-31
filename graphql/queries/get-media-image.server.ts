export type GetMediaImage = { fileId: string };

export const getMediaImageQuery = (fileId: string) => `id:${fileId}`;

export const getMediaImage = `#graphql
    query getMediaImage($fileId: String) {
        files(first: 1, query: $fileId) {
            edges {
                node {
                    ... on MediaImage {
                        mimeType
                    }
                }
            }
        }
    }
`;
