// types/shopify.d.ts
export interface ShopifyImage {
    url: string
    altText?: string
    width?: number
    height?: number
}

export interface ShopifyPrice {
    amount: string
    currencyCode: string
}

export interface ShopifyProductVariant {
    id: string
    title: string
    availableForSale: boolean
    price: ShopifyPrice
}

export interface ShopifyProduct {
    id: string
    title: string
    description: string
    handle: string
    featuredImage: ShopifyImage
    variants: {
        edges: Array<{
            node: ShopifyProductVariant
        }>
    }
}

export interface ShopifyProductEdge {
    node: ShopifyProduct
}

export interface ShopifyProductsResponse {
    products: {
        edges: ShopifyProductEdge[]
    }
}