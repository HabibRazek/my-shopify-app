'use client';

import { useQuery } from '@apollo/client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { GET_ALL_PRODUCTS } from '@/graphql/queries';
import { useCart } from '@/context/CartContext';
import type { ShopifyProductsResponse, ShopifyProduct } from '@/types/shopify';

export default function ProductPage() {
  const { addToCart } = useCart();
  const { loading, error, data } = useQuery<ShopifyProductsResponse>(GET_ALL_PRODUCTS);
  const [addingProduct, setAddingProduct] = useState<string | null>(null);

  useEffect(() => {
    console.log('Environment Variables:', {
      domain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN,
      hasToken: !!process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN
    });
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  );

  if (error) {
    console.error('GraphQL Error:', error);
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 p-4 rounded-md">
            <p className="text-red-700">Error loading products: {error.message}</p>
            {error.networkError && (
              <p className="text-red-500 mt-2">
                Network error: Please check your API credentials and connection
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  const handleAddToCart = (product: ShopifyProduct, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setAddingProduct(product.id);
    addToCart(product);
    setTimeout(() => setAddingProduct(null), 500);
  };

  const products = data?.products?.edges || [];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Our Products</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(({ node: product }) => (
            <div key={product.id} className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <Link href={`/products/${product.handle}`}>
                {product.featuredImage && (
                  <div className="aspect-w-1 aspect-h-1 w-full">
                    <Image
                      src={product.featuredImage.url}
                      alt={product.featuredImage.altText || product.title}
                      width={500}
                      height={500}
                      className="object-cover object-center group-hover:opacity-75"
                    />
                  </div>
                )}
              </Link>
              <div className="p-4">
                <h2 className="text-lg font-medium text-gray-900">{product.title}</h2>
                <p className="mt-1 text-sm text-gray-500">
                  {product.variants.edges[0]?.node.price.amount} {product.variants.edges[0]?.node.price.currencyCode}
                </p>
                <button
                  onClick={(e) => handleAddToCart(product, e)}
                  disabled={!product.variants.edges[0]?.node.availableForSale || addingProduct === product.id}
                  className={`mt-4 w-full py-2 px-4 rounded transition-colors ${
                    addingProduct === product.id
                      ? 'bg-green-500 text-white'
                      : product.variants.edges[0]?.node.availableForSale
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {addingProduct === product.id 
                    ? '✓ Added' 
                    : product.variants.edges[0]?.node.availableForSale 
                    ? 'Add to Cart' 
                    : 'Out of Stock'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}