
'use client'
import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useCart } from '@/context/CartContext';
import CartSlider from './CartSlider';

export default function NavBar() {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { cart } = useCart();
    
    const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

    return (
        <>
            <nav className="bg-white shadow-md fixed w-full z-20 top-0">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex-shrink-0 flex items-center">
                            <Link href="/" className="text-xl font-bold text-gray-800">
                                Your Store
                            </Link>
                        </div>
                        
                        <div className="flex items-center space-x-8">
                            <Link href="/products" className="text-gray-600 hover:text-gray-900">
                                Products
                            </Link>
                            
                            <button
                                onClick={() => setIsCartOpen(true)}
                                className="relative p-2 text-gray-600 hover:text-gray-900"
                                aria-label="Cart"
                            >
                                <ShoppingCartIcon className="h-6 w-6" />
                                {cartItemsCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                        {cartItemsCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <CartSlider 
                isOpen={isCartOpen} 
                onClose={() => setIsCartOpen(false)} 
            />
        </>
    );
}