export type GetShopImagesParams = {
  first?: number;
  last?: number;
  before?: string;
  after?: string;
};

export const getShopImages = `#graphql
    query getShopImages(
        $first: Int
        $last: Int
        $before: String
        $after: String
    ) {
        files(
            first: $first,
            last: $last,
            before: $before,
            after: $after
        ) {
            edges {
                node {
                    id
                    alt
                }
            }
            pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
            }
        }
    }
`;
