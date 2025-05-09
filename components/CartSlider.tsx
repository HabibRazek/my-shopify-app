'use client'
import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import CheckoutModal from './CheckoutModal';
import { CartItem } from '@/types/shopify';

interface CartSliderProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CartSlider({ isOpen, onClose }: CartSliderProps) {
    const { cart, removeFromCart, updateQuantity } = useCart();
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    const total = cart.reduce((sum: number, item: CartItem) => {
        return sum + (parseFloat(item.price.amount) * item.quantity);
    }, 0);

    const handleCheckout = () => {
        onClose(); // Close cart first
        setTimeout(() => {
            setIsCheckoutOpen(true); // Open checkout after cart is closed
        }, 300); // Match transition duration
    };

    return (
        <>
            <Transition.Root show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-40" onClose={onClose}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-in-out duration-500"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in-out duration-500"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-hidden">
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                                <Transition.Child
                                    as={Fragment}
                                    enter="transform transition ease-in-out duration-500"
                                    enterFrom="translate-x-full"
                                    enterTo="translate-x-0"
                                    leave="transform transition ease-in-out duration-500"
                                    leaveFrom="translate-x-0"
                                    leaveTo="translate-x-full"
                                >
                                    <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                                        <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                                            <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                                                <div className="flex items-start justify-between">
                                                    <Dialog.Title className="text-lg font-medium text-gray-900">
                                                        Shopping Cart
                                                    </Dialog.Title>
                                                    <button
                                                        type="button"
                                                        className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                                                        onClick={onClose}
                                                    >
                                                        <XMarkIcon className="h-6 w-6" />
                                                    </button>
                                                </div>

                                                <div className="mt-8">
                                                    {cart.length === 0 ? (
                                                        <p className="text-center text-gray-500">
                                                            Your cart is empty
                                                        </p>
                                                    ) : (
                                                        <div className="flow-root">
                                                            <ul className="-my-6 divide-y divide-gray-200">
                                                                {cart.map((item) => (
                                                                    <li key={item.id} className="flex py-6">
                                                                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                                                            <Image
                                                                                src={item.image}
                                                                                alt={item.title}
                                                                                width={96}
                                                                                height={96}
                                                                                className="h-full w-full object-cover object-center"
                                                                            />
                                                                        </div>

                                                                        <div className="ml-4 flex flex-1 flex-col">
                                                                            <div>
                                                                                <div className="flex justify-between text-base font-medium text-gray-900">
                                                                                    <h3>{item.title}</h3>
                                                                                    <p className="ml-4">
                                                                                        {new Intl.NumberFormat('en-US', {
                                                                                            style: 'currency',
                                                                                            currency: item.price.currencyCode
                                                                                        }).format(parseFloat(item.price.amount) * item.quantity)}
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex flex-1 items-end justify-between text-sm">
                                                                                <div className="flex items-center space-x-2">
                                                                                    <span className="text-gray-500">Qty</span>
                                                                                    <div className="flex items-center border border-gray-300 rounded-md">
                                                                                        <button
                                                                                            type="button"
                                                                                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                                                            className="p-1 hover:bg-gray-100 rounded-l-md"
                                                                                            disabled={item.quantity <= 1}
                                                                                        >
                                                                                            <MinusIcon className="h-4 w-4 text-gray-600" />
                                                                                        </button>
                                                                                        <span className="px-4 py-1 text-gray-900 select-none">
                                                                                            {item.quantity}
                                                                                        </span>
                                                                                        <button
                                                                                            type="button"
                                                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                                            className="p-1 hover:bg-gray-100 rounded-r-md"
                                                                                        >
                                                                                            <PlusIcon className="h-4 w-4 text-gray-600" />
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => removeFromCart(item.id)}
                                                                                    className="font-medium text-blue-600 hover:text-blue-500"
                                                                                >
                                                                                    Remove
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {cart.length > 0 && (
                                                <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                                        <p>Subtotal</p>
                                                        <p>
                                                            {new Intl.NumberFormat('en-US', {
                                                                style: 'currency',
                                                                currency: cart[0]?.price.currencyCode || 'USD'
                                                            }).format(total)}
                                                        </p>
                                                    </div>
                                                    <p className="mt-0.5 text-sm text-gray-500">
                                                        Shipping and taxes calculated at checkout.
                                                    </p>
                                                    <div className="mt-6">
                                                        <button
                                                            onClick={handleCheckout}
                                                            className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
                                                        >
                                                            Checkout
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>

            {isCheckoutOpen && (
                <CheckoutModal
                    isOpen={isCheckoutOpen} 
                    onClose={() => setIsCheckoutOpen(false)} 
                />
            )}
        </>
    );
}