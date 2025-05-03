import { NextResponse } from 'next/server';

interface OrderItem {
    variantId: string;
    quantity: number;
}

interface OrderPayload {
    customer: {
        email: string;
        firstName: string;
        lastName: string;
        phone: string;
    };
    address: {
        address1: string;
        city: string;
        province: string;
        zip: string;
    };
    items: OrderItem[];
    note?: string;
}

function formatVariantId(variantId: string): string {
    return variantId.replace('gid://shopify/ProductVariant/', '');
}

export async function POST(request: Request) {
    try {
        const body = await request.json() as OrderPayload;
        const { customer, address, items, note } = body;

        // Validate required fields
        if (!customer.email || !address.address1 || !items?.length) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Validate API credentials
        const shopDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
        const adminToken = process.env.SHOPIFY_ACCESS_TOKEN;

        if (!adminToken || !shopDomain) {
            console.error('Missing Shopify API credentials');
            return NextResponse.json(
                { success: false, error: 'Server configuration error' },
                { status: 500 }
            );
        }

        // Format variant IDs and prepare line items
        const formattedItems = items.map(item => ({
            variant_id: formatVariantId(item.variantId),
            quantity: item.quantity
        }));

        const response = await fetch(
            `https://${shopDomain}/admin/api/2024-01/draft_orders.json`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Access-Token': adminToken,
                },
                body: JSON.stringify({
                    draft_order: {
                        line_items: formattedItems,
                        customer: {
                            email: customer.email,
                            first_name: customer.firstName,
                            last_name: customer.lastName,
                            phone: customer.phone,
                        },
                        shipping_address: {
                            first_name: customer.firstName,
                            last_name: customer.lastName,
                            address1: address.address1,
                            city: address.city,
                            province: address.province,
                            zip: address.zip,
                            country: "US",
                            phone: customer.phone,
                        },
                        note,
                        tags: "COD", // Changed from array to string
                        financial_status: "pending",
                        payment_terms: {
                            payment_terms_type: "net",
                            payment_terms_name: "Cash on Delivery",
                            due_in_days: 0
                        }
                    }
                }),
            }
        );

        const responseData = await response.json();

        if (!response.ok) {
            console.error('Shopify API Error:', responseData);
            return NextResponse.json(
                {
                    success: false,
                    error: responseData.errors || 'Failed to create order',
                    details: responseData
                },
                { status: response.status }
            );
        }

        return NextResponse.json({
            success: true,
            order: {
                id: responseData.draft_order.id,
                name: responseData.draft_order.name,
                totalPrice: responseData.draft_order.total_price,
            },
        });

    } catch (error) {
        console.error('Order creation error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to create order',
            },
            { status: 500 }
        );
    }
}