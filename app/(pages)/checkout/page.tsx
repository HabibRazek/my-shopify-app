'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { ShopifyOrder } from '@/types/shopify';

export default function CheckoutPage() {
    const router = useRouter();
    const { cart, submitOrder, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [orderDetails, setOrderDetails] = useState<ShopifyOrder | null>(null);

    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
        address1: '',
        city: '',
        province: '',
        zip: '',
        note: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { email, firstName, lastName, phone, address1, city, province, zip, note } = formData;

            const result = await submitOrder(
                { email, firstName, lastName, phone },
                { address1, city, province, zip, country: 'US' },
                note
            );

            if (result.success && result.order) {
                setOrderDetails(result.order);
                setSuccess(true);
                clearCart();
            } else {
                throw new Error(result.error || 'Failed to place order');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    if (success && orderDetails) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
                    <h1 className="text-2xl font-bold text-green-600 mb-4">Order Placed Successfully!</h1>
                    <p className="mb-2">Order #: {orderDetails.name}</p>
                    <p className="mb-4">We&apos;ll contact you to confirm delivery details.</p>
                    <p className="font-semibold">Payment Method: Cash on Delivery</p>
                    <button
                        onClick={() => router.push('/')}
                        className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-8">Checkout</h1>

                <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
                    <div className="grid grid-cols-1 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Phone</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border rounded"
                            />
                        </div>
                    </div>

                    <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
                    <div className="grid grid-cols-1 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium mb-1">Address</label>
                            <input
                                type="text"
                                name="address1"
                                value={formData.address1}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">State/Province</label>
                                <input
                                    type="text"
                                    name="province"
                                    value={formData.province}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">ZIP/Postal Code</label>
                            <input
                                type="text"
                                name="zip"
                                value={formData.zip}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Order Notes (Optional)</label>
                            <textarea
                                name="note"
                                value={formData.note}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                rows={3}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || cart.length === 0}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition disabled:bg-gray-400"
                    >
                        {loading ? 'Processing...' : 'Place Order (Cash on Delivery)'}
                    </button>
                </form>
            </div>
        </div>
    );
}