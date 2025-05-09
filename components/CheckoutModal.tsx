'use client';

import { useState, useEffect, Fragment } from 'react';
import { useCart } from '@/context/CartContext';
import { Country, ShopifyOrder } from '@/types/shopify';
import { getCountries } from '@/utils/address';
import Image from 'next/image';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onError?: (error: string) => void;
}

export default function CheckoutModal({ isOpen, onClose, onError }: CheckoutModalProps) {
    const { cart, submitOrder, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [orderDetails, setOrderDetails] = useState<ShopifyOrder | null>(null);

    const [countries, setCountries] = useState<Country[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
        address1: '',
        address2: '',
        city: '',
        country: '',
        province: '',
        zip: '',
        note: ''
    });

    const router = useRouter();

    const CASH_ON_DELIVERY_FEE = 8;

    const calculateTotal = () => {
        const itemsTotal = cart.reduce((sum, item) => {
            return sum + (parseFloat(item.price.amount) * item.quantity);
        }, 0);
        return itemsTotal + CASH_ON_DELIVERY_FEE;
    };

    useEffect(() => {
        const allCountries = getCountries();
        setCountries(allCountries);

        const tunisia = allCountries.find(country => country.code === 'TN');
        if (tunisia) {
            setSelectedCountry(tunisia);
            setFormData(prev => ({
                ...prev,
                country: tunisia.name,
                countryCode: tunisia.code
            }));
        }
    }, []);

    // Reset form state when modal opens
    useEffect(() => {
        if (isOpen) {
            setSuccess(false);
            setError(null);
            setOrderDetails(null);
        }
    }, [isOpen]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCountryChange = (value: string) => {
        const country = countries.find(c => c.code === value);
        if (country) {
            setSelectedCountry(country);
            setFormData(prev => ({
                ...prev,
                country: country.name,
                countryCode: country.code,
                province: ''
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Validate required fields
            if (!formData.email || !formData.firstName || !formData.phone || !formData.address1 || !formData.city) {
                throw new Error('Please fill in all required fields');
            }

            // Phone validation
            if (!formData.phone.match(/^\d{8}$/)) {
                throw new Error('Please enter a valid 8-digit phone number');
            }

            const formattedPhone = `+${selectedCountry?.phone || '216'}${formData.phone}`;

            const result = await submitOrder(
                {
                    email: formData.email,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    phone: formattedPhone
                },
                {
                    address1: formData.address1,
                    address2: formData.address2,
                    city: formData.city,
                    country: formData.country,
                    province: formData.province,
                    zip: formData.zip
                },
                formData.note
            );

            if (result.success && result.order) {
                setOrderDetails(result.order);
                setSuccess(true);
                clearCart();
                toast.success('Order placed successfully!');
                // Don't close modal immediately
            } else {
                throw new Error(result.error || 'Failed to place order');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to place order';
            setError(errorMessage);
            onError?.(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleContinueShopping = () => {
        onClose();
        router.push('/products');
    };

    const renderContent = () => {
        if (success && orderDetails) {
            return (
                <div className="space-y-4">
                    <div className="text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="mt-3 text-lg font-medium">Order Placed Successfully!</h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Order #: {orderDetails.name}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            We&apos;ll contact you to confirm delivery details.
                        </p>
                    </div>
                    <div className="mt-6 border-t pt-6">
                        <h3 className="text-sm font-medium">Payment Details</h3>
                        <div className="mt-2 space-y-1 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Payment Method:</span>
                                <span>Cash on Delivery</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Delivery Fee:</span>
                                <span>{CASH_ON_DELIVERY_FEE} TND</span>
                            </div>
                        </div>
                    </div>
                    <Button
                        onClick={handleContinueShopping}
                        className="mt-6 w-full"
                    >
                        Continue Shopping
                    </Button>
                </div>
            );
        }

        return (
            <div className="space-y-6">
                <div className="space-y-2">
                    <h2 className="text-lg font-semibold">Order Summary</h2>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Subtotal:</span>
                            <span className="text-sm">{(calculateTotal() - CASH_ON_DELIVERY_FEE).toFixed(2)} TND</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Cash on Delivery Fee:</span>
                            <span className="text-sm text-blue-600">{CASH_ON_DELIVERY_FEE.toFixed(2)} TND</span>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex justify-between font-medium">
                            <span>Total:</span>
                            <span>{calculateTotal().toFixed(2)} TND</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">Contact Information</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="country">Country/Region</Label>
                            <Select
                                value={selectedCountry?.code || ''}
                                onValueChange={handleCountryChange}
                                required
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a country" />
                                </SelectTrigger>
                                <SelectContent>
                                    {countries.map(country => (
                                        <SelectItem key={country.code} value={country.code}>
                                            <div className="flex items-center gap-2">
                                                <Image
                                                    src={`https://flagcdn.com/${country.code.toLowerCase()}.svg`}
                                                    alt={`${country.name} flag`}
                                                    width={20}
                                                    height={15}
                                                    className="rounded"
                                                />
                                                {country.name}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="city">City</Label>
                                <Input
                                    id="city"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="zip">Postal Code</Label>
                                <Input
                                    id="zip"
                                    name="zip"
                                    value={formData.zip}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address1">Street Address</Label>
                            <Input
                                id="address1"
                                name="address1"
                                value={formData.address1}
                                onChange={handleChange}
                                required
                                placeholder="Street address, P.O. box"
                            />
                            <Input
                                id="address2"
                                name="address2"
                                value={formData.address2}
                                onChange={handleChange}
                                placeholder="Apartment, suite, unit, etc. (optional)"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <div className="flex gap-2">
                                <Badge variant="outline" className="flex items-center gap-1">
                                    {selectedCountry?.emoji} +{selectedCountry?.phone}
                                </Badge>
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    className="flex-1"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="note">Order Notes (Optional)</Label>
                            <Textarea
                                id="note"
                                name="note"
                                value={formData.note}
                                onChange={handleChange}
                                rows={2}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="rounded-md bg-destructive/15 p-4 text-sm text-destructive">
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={loading || cart.length === 0}
                        className="w-full"
                    >
                        {loading ? 'Processing...' : 'Place Order (Cash on Delivery)'}
                    </Button>
                </form>
            </div>
        );
    };

    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Dialog.Panel className="relative w-full max-w-2xl transform rounded-lg bg-white p-6 shadow-xl transition-all">
                            {/* Only show close button if not in success state */}
                            {!success && (
                                <button
                                    type="button"
                                    className="absolute right-4 top-4 rounded-md text-gray-400 hover:text-gray-500"
                                    onClick={onClose}
                                >
                                    <span className="sr-only">Close</span>
                                    <XMarkIcon className="h-6 w-6" />
                                </button>
                            )}
                            {renderContent()}
                        </Dialog.Panel>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}