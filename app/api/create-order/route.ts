import { OrderPayload } from '@/types/shopify';
import { NextResponse } from 'next/server';

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

        const response = await fetch(
            `https://${shopDomain}/admin/api/2024-01/orders.json`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Access-Token': adminToken as string,
                },
                body: JSON.stringify({
                    order: {
                        line_items: items.map(item => ({
                            variant_id: item.variantId.replace('gid://shopify/ProductVariant/', ''),
                            quantity: item.quantity
                        })),
                        customer: {
                            email: customer.email,
                            first_name: customer.firstName,
                            last_name: customer.lastName,
                            phone: customer.phone,
                            accepts_marketing: true
                        },
                        billing_address: {
                            first_name: customer.firstName,
                            last_name: customer.lastName,
                            address1: address.address1,
                            city: address.city,
                            province: address.province,
                            zip: address.zip,
                            country: 'Tunisia',
                            phone: customer.phone
                        },
                        shipping_address: {
                            first_name: customer.firstName,
                            last_name: customer.lastName,
                            address1: address.address1,
                            address2: address.address2,
                            city: address.city,
                            province: address.province,
                            zip: address.zip,
                            country: address.country,
                            country_code: address.countryCode,
                            phone: customer.phone
                        },
                        note: note || '',
                        tags: 'COD',
                        financial_status: 'pending',
                        fulfillment_status: 'unfulfilled',
                        gateway: 'Cash on Delivery',
                        currency: 'TND',
                        payment_terms: {
                            payment_terms_type: "net",
                            payment_terms_name: "Cash on Delivery",
                            due_in_days: 0
                        },
                        shipping_lines: [{
                            title: `Cash on Delivery - ${address.province}, Tunisia`,
                            price: '0.00',
                            code: 'COD'
                        }]
                    }
                }),
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Shopify API Error:', errorData);
            throw new Error(errorData.errors || 'Failed to create order');
        }

        const data = await response.json();
        return NextResponse.json({
            success: true,
            order: data.order
        });

    } catch (error) {
        console.error('Order creation error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to create order'
            },
            { status: 500 }
        );
    }
}