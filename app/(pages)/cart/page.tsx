'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
    const { cart, removeFromCart, clearCart } = useCart();

    const calculateTotal = () => {
        return cart.reduce((total, item) => {
            const price = parseFloat(item.variants.edges[0].node.price.amount);
            return total + price;
        }, 0).toFixed(2);
    };

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-8">Your Cart</h1>

                {cart.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-lg mb-4">Your cart is empty</p>
                        <Link href="/" className="text-blue-600 hover:text-blue-800">
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <div className="divide-y divide-gray-200">
                            {cart.map(item => (
                                <div key={item.id} className="p-4 flex justify-between items-center">
                                    <div className="flex items-center space-x-4">
                                        <img
                                            src={item.featuredImage?.url}
                                            alt={item.title}
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                        <div>
                                            <h3 className="font-medium">{item.title}</h3>
                                            <p className="text-gray-600 text-sm">
                                                ${item.variants.edges[0].node.price.amount} {item.variants.edges[0].node.price.currencyCode}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="p-4 border-t border-gray-200">
                            <div className="flex justify-between mb-4">
                                <span className="font-semibold">Total:</span>
                                <span className="font-semibold">
                                    ${calculateTotal()} {cart[0]?.variants.edges[0].node.price.currencyCode}
                                </span>
                            </div>

                            <div className="flex space-x-4">
                                <button
                                    onClick={clearCart}
                                    className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition"
                                >
                                    Clear Cart
                                </button>
                                <Link
                                    href="/checkout"
                                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition text-center"
                                >
                                    Proceed to Checkout
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}