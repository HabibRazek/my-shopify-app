'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import type { CartItem, ShopifyProduct } from '@/types/shopify';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ShoppingCart, Loader2 } from 'lucide-react';

interface ProductCardProps {
  product: ShopifyProduct;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const variant = product.variants.edges[0]?.node;
  const price = variant?.price;
  const isAvailable = variant?.availableForSale;

  const handleAddToCart = () => {
    if (!variant || !price) return;

    const cartItem: CartItem = {
      id: product.id,
      title: product.title,
      quantity: 1,
      image: product.featuredImage?.url || '/placeholder-product.jpg',
      price: {
        amount: price.amount,
        currencyCode: price.currencyCode,
      },
      variantId: variant.id,
    };

    setIsAdding(true);
    addToCart(cartItem);

    toast.success(`${product.title} added to cart`, {
      position: 'bottom-center',
      duration: 1500,
    });

    setTimeout(() => setIsAdding(false), 1000);
  };

  return (
    <Card className={`group overflow-hidden transition-shadow hover:shadow-sm ${className}`}>
      <CardHeader className="p-0 relative">
        <Link href={`/products/${product.handle}`} className="block">
          <div className="aspect-square w-full relative overflow-hidden">
            <Image
              src={product.featuredImage?.url || '/placeholder-product.jpg'}
              alt={product.title}
              fill
              className="object-cover transition-all duration-200 group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={false}
            />
            {!isAvailable && (
              <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                <Badge variant="outline" className="text-xs py-0.5 px-1.5">
                  Out of Stock
                </Badge>
              </div>
            )}
          </div>
        </Link>
      </CardHeader>

      <CardContent className="p-2 space-y-1">
        <Link href={`/products/${product.handle}`}>
          <h3 className="font-medium text-sm leading-tight line-clamp-2 hover:underline">
            {product.title}
          </h3>
        </Link>
        <p className="text-base font-semibold">
          {price?.amount} {price?.currencyCode}
        </p>
      </CardContent>

      <CardFooter className="p-2 pt-0">
        <Button
          onClick={handleAddToCart}
          disabled={!isAvailable || isAdding}
          className="w-full gap-1.5 h-8 text-xs"
          size="sm"
          variant="outline"
        >
          {isAdding ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <ShoppingCart className="h-3 w-3" />
              {isAvailable ? 'Add to Cart' : 'Unavailable'}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}