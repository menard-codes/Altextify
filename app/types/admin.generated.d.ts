/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import type * as AdminTypes from './admin.types.d.ts';

export type PopulateProductMutationVariables = AdminTypes.Exact<{
  product: AdminTypes.ProductCreateInput;
}>;


export type PopulateProductMutation = { productCreate?: AdminTypes.Maybe<{ product?: AdminTypes.Maybe<(
      Pick<AdminTypes.Product, 'id' | 'title' | 'handle' | 'status'>
      & { variants: { edges: Array<{ node: Pick<AdminTypes.ProductVariant, 'id' | 'price' | 'barcode' | 'createdAt'> }> } }
    )> }> };

export type ShopifyReactRouterTemplateUpdateVariantMutationVariables = AdminTypes.Exact<{
  productId: AdminTypes.Scalars['ID']['input'];
  variants: Array<AdminTypes.ProductVariantsBulkInput> | AdminTypes.ProductVariantsBulkInput;
}>;


export type ShopifyReactRouterTemplateUpdateVariantMutation = { productVariantsBulkUpdate?: AdminTypes.Maybe<{ productVariants?: AdminTypes.Maybe<Array<Pick<AdminTypes.ProductVariant, 'id' | 'price' | 'barcode' | 'createdAt'>>> }> };

export type BulkUpdateImageAltMutationVariables = AdminTypes.Exact<{
  images: Array<AdminTypes.FileUpdateInput> | AdminTypes.FileUpdateInput;
}>;


export type BulkUpdateImageAltMutation = { fileUpdate?: AdminTypes.Maybe<{ files?: AdminTypes.Maybe<Array<Pick<AdminTypes.ExternalVideo, 'id' | 'alt'> | Pick<AdminTypes.GenericFile, 'id' | 'alt'> | Pick<AdminTypes.MediaImage, 'id' | 'alt'> | Pick<AdminTypes.Model3d, 'id' | 'alt'> | Pick<AdminTypes.Video, 'id' | 'alt'>>>, userErrors: Array<Pick<AdminTypes.FilesUserError, 'field' | 'message'>> }> };

export type GetProductIdsQueryVariables = AdminTypes.Exact<{
  first?: AdminTypes.InputMaybe<AdminTypes.Scalars['Int']['input']>;
  last?: AdminTypes.InputMaybe<AdminTypes.Scalars['Int']['input']>;
  before?: AdminTypes.InputMaybe<AdminTypes.Scalars['String']['input']>;
  after?: AdminTypes.InputMaybe<AdminTypes.Scalars['String']['input']>;
  search?: AdminTypes.InputMaybe<AdminTypes.Scalars['String']['input']>;
}>;


export type GetProductIdsQuery = { products: { edges: Array<{ node: Pick<AdminTypes.Product, 'id'> }>, pageInfo: Pick<AdminTypes.PageInfo, 'startCursor' | 'hasNextPage' | 'endCursor' | 'hasPreviousPage'> } };

export type GetProductQueryVariables = AdminTypes.Exact<{
  id: AdminTypes.Scalars['ID']['input'];
}>;


export type GetProductQuery = { product?: AdminTypes.Maybe<(
    Pick<AdminTypes.Product, 'id' | 'title' | 'descriptionHtml' | 'hasOnlyDefaultVariant'>
    & { variants: { edges: Array<{ node: (
          Pick<AdminTypes.ProductVariant, 'id'>
          & { selectedOptions: Array<Pick<AdminTypes.SelectedOption, 'name' | 'value'>>, media: { edges: Array<{ node: Pick<AdminTypes.ExternalVideo, 'id'> | Pick<AdminTypes.MediaImage, 'id'> | Pick<AdminTypes.Model3d, 'id'> | Pick<AdminTypes.Video, 'id'> }> } }
        ) }> }, media: { edges: Array<{ node: (
          Pick<AdminTypes.ExternalVideo, 'id'>
          & { preview?: AdminTypes.Maybe<{ image?: AdminTypes.Maybe<Pick<AdminTypes.Image, 'url'>> }> }
        ) | (
          Pick<AdminTypes.MediaImage, 'id'>
          & { preview?: AdminTypes.Maybe<{ image?: AdminTypes.Maybe<Pick<AdminTypes.Image, 'url'>> }> }
        ) | (
          Pick<AdminTypes.Model3d, 'id'>
          & { preview?: AdminTypes.Maybe<{ image?: AdminTypes.Maybe<Pick<AdminTypes.Image, 'url'>> }> }
        ) | (
          Pick<AdminTypes.Video, 'id'>
          & { preview?: AdminTypes.Maybe<{ image?: AdminTypes.Maybe<Pick<AdminTypes.Image, 'url'>> }> }
        ) }> } }
  )> };

interface GeneratedQueryTypes {
  "\n        #graphql\n        query getProductIds(\n            $first: Int\n            $last: Int\n            $before: String\n            $after: String\n            $search: String\n        ) {\n            products(\n                first: $first\n                last: $last\n                before: $before\n                after: $after\n                query: $search\n            ) {\n                edges {\n                    node {\n                        id\n                    }\n                }\n                pageInfo {\n                    startCursor\n                    hasNextPage\n                    endCursor\n                    hasPreviousPage\n                }\n            }\n        }\n    ": {return: GetProductIdsQuery, variables: GetProductIdsQueryVariables},
  "\n        #graphql\n        query getProduct(\n            $id: ID!\n        ) {\n            product(id: $id) {\n                id\n                title\n                descriptionHtml\n                hasOnlyDefaultVariant\n                # Assuming that, realistically, all stores will not exceed\n                # the maximum number of variants: 250 (no pagination intended for this use case)\n                variants(first: 250) {\n                    edges {\n                        node {\n                            id\n                            selectedOptions {\n                                name\n                                value\n                            }\n                            # same with this one\n                            media(first: 250) {\n                                edges {\n                                    node {\n                                        id\n                                    }\n                                }\n                            }\n                        }\n                    }\n                }\n                # Assuming a product won't exceed 250 media files associated with it\n                media(\n                    first: 250,\n                    query: \"query: media_type=IMAGE\"\n                ) {\n                    edges {\n                        node {\n                            id\n                            preview {\n                                image {\n                                    url\n                                }\n                            }\n                        }\n                    }\n                }\n            }\n        }\n    ": {return: GetProductQuery, variables: GetProductQueryVariables},
}

interface GeneratedMutationTypes {
  "#graphql\n      mutation populateProduct($product: ProductCreateInput!) {\n        productCreate(product: $product) {\n          product {\n            id\n            title\n            handle\n            status\n            variants(first: 10) {\n              edges {\n                node {\n                  id\n                  price\n                  barcode\n                  createdAt\n                }\n              }\n            }\n          }\n        }\n      }": {return: PopulateProductMutation, variables: PopulateProductMutationVariables},
  "#graphql\n    mutation shopifyReactRouterTemplateUpdateVariant($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {\n      productVariantsBulkUpdate(productId: $productId, variants: $variants) {\n        productVariants {\n          id\n          price\n          barcode\n          createdAt\n        }\n      }\n    }": {return: ShopifyReactRouterTemplateUpdateVariantMutation, variables: ShopifyReactRouterTemplateUpdateVariantMutationVariables},
  "\n        #graphql\n        mutation bulkUpdateImageAlt($images: [FileUpdateInput!]!) {\n            fileUpdate(files: $images) {\n                files {\n                    id\n                    alt\n                }\n                userErrors {\n                    field\n                    message\n                }\n            }\n        }\n    ": {return: BulkUpdateImageAltMutation, variables: BulkUpdateImageAltMutationVariables},
}
declare module '@shopify/admin-api-client' {
  type InputMaybe<T> = AdminTypes.InputMaybe<T>;
  interface AdminQueries extends GeneratedQueryTypes {}
  interface AdminMutations extends GeneratedMutationTypes {}
}
