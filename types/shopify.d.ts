// types/shopify.d.ts
export interface ShopifyImage {
    url: string;
    altText?: string;
    width?: number;
    height?: number;
}

export interface ShopifyPrice {
    amount: string;
    currencyCode: string;
}

export interface ShopifyProductVariant {
    id: string;
    title: string;
    availableForSale: boolean;
    price: ShopifyPrice;
    inventoryQuantity?: number;
}

export interface ShopifyProduct {
    id: string;
    title: string;
    description: string;
    handle: string;
    featuredImage: ShopifyImage;
    variants: {
        edges: Array<{
            node: ShopifyProductVariant;
        }>;
    };
}

export interface ShopifyProductEdge {
    node: ShopifyProduct;
}

export interface ShopifyProductsResponse {
    products: {
        edges: ShopifyProductEdge[];
    };
}

export interface ShopifyCustomer {
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
}

export interface ShopifyAddress {
    address1: string;
    address2?: string;
    city: string;
    province?: string;
    country?: string;
    zip: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
}

export interface ShopifyLineItem {
    variantId: string;
    quantity: number;
}

export interface ShopifyOrder {
    id: string;
    name: string;
    email?: string;
    createdAt?: string;
    fulfillmentStatus?: string;
    financialStatus?: string;
    totalPrice?: ShopifyPrice;
    shippingAddress?: ShopifyAddress;
    lineItems?: {
        edges: Array<{
            node: {
                title: string;
                quantity: number;
                variant?: {
                    title: string;
                    price: ShopifyPrice;
                };
            };
        }>;
    };
}