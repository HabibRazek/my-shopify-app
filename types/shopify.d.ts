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
    firstName?: string;
    lastName?: string;
    company?: string;
    address1: string;
    address2?: string;
    city: string;
    province: string;
    zip: string;
    country: string;
    countryCode?: string;
    phone?: string;
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

export interface OrderItem {
    variantId: string;
    quantity: number;
}

export interface InternationalAddress {
    firstName: string;
    lastName: string;
    company?: string;
    address1: string;
    address2?: string;
    city: string;
    province: string;
    zip: string;
    country: string;
    countryCode: string;
    phone: string;
}

export interface OrderCustomer {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    acceptsMarketing?: boolean;
}

export interface OrderPayload {
    customer: OrderCustomer;
    address: InternationalAddress;
    billingAddressSameAsShipping?: boolean;
    billingAddress?: InternationalAddress;
    items: OrderItem[];
    note?: string;
    tags?: string[];
    currency?: string;
    metadata?: Record<string, string | number | boolean>;
}

export interface CreateOrderResponse {
    success: boolean;
    order?: ShopifyOrder;
    error?: string;
}

export interface Country {
    code: string;
    name: string;
    phone: string;
    emoji: string;
}

export interface Address {
    firstName: string;
    lastName: string;
    company?: string;
    address1: string;
    address2?: string;
    city: string;
    province: string;
    zip: string;
    country: string;
    countryCode: string;
    phone: string;
}


export interface CartItemPrice {
    amount: string;
    currencyCode: string;
}

export interface CartItem {
    id: string;
    title: string;
    quantity: number;
    image: string;
    price: CartItemPrice;
    variantId: string;
}