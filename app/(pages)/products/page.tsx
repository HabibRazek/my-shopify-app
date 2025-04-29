"use client"

import { useQuery } from '@apollo/client'
import { GET_PRODUCTS } from '@/graphql/queries'
import { apolloClient } from '@/lib/apollo-client' // Modified client export
import ProductCard from '@/app/_components/ProductCard'
import { ShopifyProductsResponse } from '@/types/shopify'

export default function Products() {
  const { loading, error, data } = useQuery<ShopifyProductsResponse>(GET_PRODUCTS, {
    variables: { first: 10 },
    client: apolloClient, // Use the client instance directly
    onError: (err) => {
      console.error('GraphQL Error Details:', {
        message: err.message,
        networkError: err.networkError,
        graphQLErrors: err.graphQLErrors
      })
    }
  })

  if (loading) return <div className="p-8">Loading products...</div>
  
  if (error) return (
    <div className="p-8 text-red-500">
      <h2>Error loading products</h2>
      <p>{error.message}</p>
      <pre>{JSON.stringify(error, null, 2)}</pre>
    </div>
  )

  if (!data?.products?.edges?.length) {
    return <div className="p-8">No products found</div>
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Products</h2>
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {data.products.edges.map((edge) => (
            <ProductCard key={edge.node.id} product={edge.node} />
          ))}
        </div>
      </div>
    </div>
  )
}