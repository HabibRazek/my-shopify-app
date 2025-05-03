"use client"

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/context/CartContext'
import type { ShopifyProduct } from '@/types/shopify'

interface ProductCardProps {
  product: ShopifyProduct
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const [isAdding, setIsAdding] = useState(false)
  const price = product.variants.edges[0]?.node.price
  const isAvailable = product.variants.edges[0]?.node.availableForSale

  const handleAddToCart = () => {
    setIsAdding(true)
    addToCart(product)
    setTimeout(() => setIsAdding(false), 500)
  }

  return (
    <div className="group relative">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
        <Link href={`/products/${product.handle}`}>
          <Image
            src={product.featuredImage?.url || '/placeholder-product.jpg'}
            alt={product.title}
            width={500}
            height={500}
            className="h-full w-full object-cover object-center lg:h-full lg:w-full"
          />
        </Link>
      </div>
      <div className="mt-4 flex flex-col gap-2">
        <div>
          <h3 className="text-sm text-gray-700">
            <Link href={`/products/${product.handle}`}>
              {product.title}
            </Link>
          </h3>
          <p className="text-sm font-medium text-gray-900">
            {price?.amount} {price?.currencyCode}
          </p>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={!isAvailable || isAdding}
          className={`w-full py-2 px-4 rounded text-sm transition-all duration-200 ${
            isAvailable
              ? isAdding
                ? 'bg-green-500 text-white'
                : 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isAdding ? '✓ Added' : isAvailable ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  )
}