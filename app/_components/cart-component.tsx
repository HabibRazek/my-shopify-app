'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Trash2, ArrowLeft, ShoppingCart } from 'lucide-react';

export default function CartPage() {
    const { cart, removeFromCart, clearCart, updateQuantity } = useCart();

    const calculateTotal = () => {
        return cart.reduce((total, item) => {
            const price = parseFloat(item.price.amount);
            return total + price * item.quantity;
        }, 0).toFixed(2);
    };

    return (
        <div className="container py-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">Your Shopping Cart</h1>
                    <Badge variant="secondary" className="px-3 py-1 text-sm">
                        {cart.length} {cart.length === 1 ? 'item' : 'items'}
                    </Badge>
                </div>

                {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-6 py-12">
                        <ShoppingCart className="w-16 h-16 text-muted-foreground" />
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-semibold">Your cart is empty</h2>
                            <p className="text-muted-foreground">
                                Looks like you haven&apos;t added anything to your cart yet
                            </p>
                        </div>
                        <Button asChild variant="default">
                            <Link href="/products" className="flex items-center gap-2">
                                <ArrowLeft className="w-4 h-4" />
                                Continue Shopping
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <Card>
                        <CardHeader className="p-0">
                            <div className="p-6">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-lg font-medium">Cart Items</h2>
                                    <Button
                                        variant="ghost"
                                        onClick={clearCart}
                                        className="text-destructive hover:text-destructive"
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Clear Cart
                                    </Button>
                                </div>
                            </div>
                            <Separator />
                        </CardHeader>

                        <CardContent className="p-0">
                            <div className="divide-y">
                                {cart.map((item) => (
                                    <div key={item.id} className="p-6">
                                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                                            <div className="flex items-start gap-4">
                                                <div className="relative aspect-square w-20 rounded-md overflow-hidden border">
                                                    <Image
                                                        src={item.image}
                                                        alt={item.title}
                                                        fill
                                                        className="object-cover"
                                                        sizes="80px"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <h3 className="font-medium line-clamp-2">{item.title}</h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        ${item.price.amount} {item.price.currencyCode}
                                                    </p>
                                                    <div className="flex items-center gap-2 pt-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-8 w-8 p-0"
                                                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            -
                                                        </Button>
                                                        <Input
                                                            type="number"
                                                            min="1"
                                                            value={item.quantity}
                                                            onChange={(e) => updateQuantity(item.id, Math.max(1, parseInt(e.target.value) || 1))}
                                                            className="w-16 h-8 text-center"
                                                        />
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-8 w-8 p-0"
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        >
                                                            +
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <p className="font-medium">
                                                    ${(parseFloat(item.price.amount) * item.quantity).toFixed(2)}
                                                </p>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-destructive hover:text-destructive h-8 px-2"
                                                    onClick={() => removeFromCart(item.id)}
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Remove
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>

                        <CardFooter className="flex flex-col gap-4 p-6 border-t">
                            <div className="flex justify-between w-full">
                                <span className="font-medium">Subtotal</span>
                                <span className="font-medium">
                                    ${calculateTotal()} {cart[0]?.price.currencyCode}
                                </span>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 w-full">
                                <Button asChild variant="outline" className="flex-1">
                                    <Link href="/products">Continue Shopping</Link>
                                </Button>
                                <Button asChild variant="default" className="flex-1">
                                    <Link href="/checkout">Proceed to Checkout</Link>
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                )}
            </div>
        </div>
    );
}