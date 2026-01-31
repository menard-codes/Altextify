/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import type * as AdminTypes from './admin.types.d.ts';

export type BulkUpdateImageAltMutationVariables = AdminTypes.Exact<{
  images: Array<AdminTypes.FileUpdateInput> | AdminTypes.FileUpdateInput;
}>;


export type BulkUpdateImageAltMutation = { fileUpdate?: AdminTypes.Maybe<{ files?: AdminTypes.Maybe<Array<Pick<AdminTypes.ExternalVideo, 'id' | 'alt'> | Pick<AdminTypes.GenericFile, 'id' | 'alt'> | Pick<AdminTypes.MediaImage, 'id' | 'alt'> | Pick<AdminTypes.Model3d, 'id' | 'alt'> | Pick<AdminTypes.Video, 'id' | 'alt'>>>, userErrors: Array<Pick<AdminTypes.FilesUserError, 'field' | 'message'>> }> };

export type GetImageProductContextQueryVariables = AdminTypes.Exact<{
  productId: AdminTypes.Scalars['ID']['input'];
}>;


export type GetImageProductContextQuery = { product?: AdminTypes.Maybe<Pick<AdminTypes.Product, 'title' | 'descriptionHtml'>> };

export type GetImageVariantContextQueryVariables = AdminTypes.Exact<{
  variantId: AdminTypes.Scalars['ID']['input'];
}>;


export type GetImageVariantContextQuery = { productVariant?: AdminTypes.Maybe<{ selectedOptions: Array<Pick<AdminTypes.SelectedOption, 'name' | 'value'>> }> };

export type GetMediaImageQueryVariables = AdminTypes.Exact<{
  query?: AdminTypes.InputMaybe<AdminTypes.Scalars['String']['input']>;
}>;


export type GetMediaImageQuery = { files: { edges: Array<{ node: Pick<AdminTypes.MediaImage, 'mimeType'> }> } };

export type GetProductIdsQueryVariables = AdminTypes.Exact<{
  first?: AdminTypes.InputMaybe<AdminTypes.Scalars['Int']['input']>;
  last?: AdminTypes.InputMaybe<AdminTypes.Scalars['Int']['input']>;
  before?: AdminTypes.InputMaybe<AdminTypes.Scalars['String']['input']>;
  after?: AdminTypes.InputMaybe<AdminTypes.Scalars['String']['input']>;
  search?: AdminTypes.InputMaybe<AdminTypes.Scalars['String']['input']>;
}>;


export type GetProductIdsQuery = { products: { edges: Array<{ node: Pick<AdminTypes.Product, 'id'> }>, pageInfo: Pick<AdminTypes.PageInfo, 'startCursor' | 'hasNextPage' | 'endCursor' | 'hasPreviousPage'> } };

export type GetProductImagesQueryVariables = AdminTypes.Exact<{
  productId: AdminTypes.Scalars['ID']['input'];
}>;


export type GetProductImagesQuery = { product?: AdminTypes.Maybe<(
    Pick<AdminTypes.Product, 'id' | 'title' | 'descriptionHtml' | 'hasOnlyDefaultVariant'>
    & { variants: { edges: Array<{ node: (
          Pick<AdminTypes.ProductVariant, 'id'>
          & { selectedOptions: Array<Pick<AdminTypes.SelectedOption, 'name' | 'value'>>, media: { edges: Array<{ node: Pick<AdminTypes.ExternalVideo, 'id' | 'alt'> | Pick<AdminTypes.MediaImage, 'id' | 'alt'> | Pick<AdminTypes.Model3d, 'id' | 'alt'> | Pick<AdminTypes.Video, 'id' | 'alt'> }> } }
        ) }> }, media: { edges: Array<{ node: (
          Pick<AdminTypes.ExternalVideo, 'id' | 'alt' | 'mediaContentType'>
          & { preview?: AdminTypes.Maybe<{ image?: AdminTypes.Maybe<Pick<AdminTypes.Image, 'url'>> }> }
        ) | (
          Pick<AdminTypes.MediaImage, 'mimeType' | 'id' | 'alt' | 'mediaContentType'>
          & { preview?: AdminTypes.Maybe<{ image?: AdminTypes.Maybe<Pick<AdminTypes.Image, 'url'>> }> }
        ) | (
          Pick<AdminTypes.Model3d, 'id' | 'alt' | 'mediaContentType'>
          & { preview?: AdminTypes.Maybe<{ image?: AdminTypes.Maybe<Pick<AdminTypes.Image, 'url'>> }> }
        ) | (
          Pick<AdminTypes.Video, 'id' | 'alt' | 'mediaContentType'>
          & { preview?: AdminTypes.Maybe<{ image?: AdminTypes.Maybe<Pick<AdminTypes.Image, 'url'>> }> }
        ) }> } }
  )> };

export type GetShopImagesQueryVariables = AdminTypes.Exact<{
  first?: AdminTypes.InputMaybe<AdminTypes.Scalars['Int']['input']>;
  last?: AdminTypes.InputMaybe<AdminTypes.Scalars['Int']['input']>;
  before?: AdminTypes.InputMaybe<AdminTypes.Scalars['String']['input']>;
  after?: AdminTypes.InputMaybe<AdminTypes.Scalars['String']['input']>;
}>;


export type GetShopImagesQuery = { files: { edges: Array<{ node: Pick<AdminTypes.ExternalVideo, 'id' | 'alt'> | Pick<AdminTypes.GenericFile, 'id' | 'alt'> | Pick<AdminTypes.MediaImage, 'id' | 'alt'> | Pick<AdminTypes.Model3d, 'id' | 'alt'> | Pick<AdminTypes.Video, 'id' | 'alt'> }>, pageInfo: Pick<AdminTypes.PageInfo, 'hasNextPage' | 'hasPreviousPage' | 'startCursor' | 'endCursor'> } };

export type GetShopInfoQueryVariables = AdminTypes.Exact<{ [key: string]: never; }>;


export type GetShopInfoQuery = { shop: Pick<AdminTypes.Shop, 'email' | 'name'> };

interface GeneratedQueryTypes {
  "#graphql\n    query getImageProductContext($productId: ID!) {\n        product(id: $productId) {\n            title\n            descriptionHtml\n        }\n    }\n": {return: GetImageProductContextQuery, variables: GetImageProductContextQueryVariables},
  "#graphql\n    query getImageVariantContext($variantId: ID!) {\n        productVariant(id: $variantId) {\n            selectedOptions {\n                name\n                value\n            }\n        }\n    }\n": {return: GetImageVariantContextQuery, variables: GetImageVariantContextQueryVariables},
  "#graphql\n    query getMediaImage($query: String) {\n        files(first: 1, query: $query) {\n            edges {\n                node {\n                    ... on MediaImage {\n                        mimeType\n                    }\n                }\n            }\n        }\n    }\n": {return: GetMediaImageQuery, variables: GetMediaImageQueryVariables},
  "#graphql\n    query getProductIds(\n        $first: Int\n        $last: Int\n        $before: String\n        $after: String\n        $search: String\n    ) {\n        products(\n            first: $first\n            last: $last\n            before: $before\n            after: $after\n            query: $search\n        ) {\n            edges {\n                node {\n                    id\n                }\n            }\n            pageInfo {\n                startCursor\n                hasNextPage\n                endCursor\n                hasPreviousPage\n            }\n        }\n    }\n": {return: GetProductIdsQuery, variables: GetProductIdsQueryVariables},
  "#graphql\n    query getProductImages(\n        $productId: ID!\n    ) {\n        product(id: $productId) {\n            id\n            title\n            descriptionHtml\n            # Assuming that, realistically, all stores will not exceed\n            # the maximum number of variants: 250 (no pagination intended for this use case)\n            hasOnlyDefaultVariant\n            variants(first: 250) {\n                edges {\n                    node {\n                        id\n                        selectedOptions {\n                            name\n                            value\n                        }\n                        # same with this one\n                        media(first: 250) {\n                            edges {\n                                node {\n                                    id\n                                    alt\n                                }\n                            }\n                        }\n                    }\n                }\n            }\n            # Assuming a product won't exceed 250 media files associated with it\n            media(\n                first: 250,\n                query: \"media_type=IMAGE\"\n            ) {\n                edges {\n                    node {\n                        id\n                        alt\n                        mediaContentType\n                        ... on MediaImage {\n                            mimeType\n                        }\n                        preview {\n                            image {\n                                url\n                            }\n                        }\n                    }\n                }\n            }\n        }\n    }\n": {return: GetProductImagesQuery, variables: GetProductImagesQueryVariables},
  "#graphql\n    query getShopImages(\n        $first: Int\n        $last: Int\n        $before: String\n        $after: String\n    ) {\n        files(\n            first: $first,\n            last: $last,\n            before: $before,\n            after: $after\n        ) {\n            edges {\n                node {\n                    id\n                    alt\n                }\n            }\n            pageInfo {\n                hasNextPage\n                hasPreviousPage\n                startCursor\n                endCursor\n            }\n        }\n    }\n": {return: GetShopImagesQuery, variables: GetShopImagesQueryVariables},
  "#graphql\n    query getShopInfo {\n        shop {\n            email\n            name\n        }\n    }\n": {return: GetShopInfoQuery, variables: GetShopInfoQueryVariables},
}

interface GeneratedMutationTypes {
  "#graphql\n    mutation bulkUpdateImageAlt($images: [FileUpdateInput!]!) {\n        fileUpdate(files: $images) {\n            files {\n                id\n                alt\n            }\n            userErrors {\n                field\n                message\n            }\n        }\n    }\n": {return: BulkUpdateImageAltMutation, variables: BulkUpdateImageAltMutationVariables},
}
declare module '@shopify/admin-api-client' {
  type InputMaybe<T> = AdminTypes.InputMaybe<T>;
  interface AdminQueries extends GeneratedQueryTypes {}
  interface AdminMutations extends GeneratedMutationTypes {}
}
