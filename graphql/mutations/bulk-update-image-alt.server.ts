import { FileUpdateInput } from "app/types/admin.types";

export type BulkUpdateImageAltParams = {
  images: Pick<FileUpdateInput, "id" | "alt">[];
};

export const bulkUpdateImageAlt = `#graphql
    mutation bulkUpdateImageAlt($images: [FileUpdateInput!]!) {
        fileUpdate(files: $images) {
            files {
                id
                alt
            }
            userErrors {
                field
                message
            }
        }
    }
`;
