export type GetProductIdsParams = {
  first?: number;
  last?: number;
  before?: string;
  after?: string;
  search?: string;
};

export const getProductIds = `#graphql
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
`;
