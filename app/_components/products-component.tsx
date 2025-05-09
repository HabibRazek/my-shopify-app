'use client';

import { useQuery } from '@apollo/client';
import { GET_ALL_PRODUCTS } from '@/graphql/queries';
import type { ShopifyProductsResponse } from '@/types/shopify';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ProductCard } from './product-card-component';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Toaster } from 'sonner';

export default function ProductsPage() {
    const { loading, error, data } = useQuery<ShopifyProductsResponse>(GET_ALL_PRODUCTS);
    
    if (loading) {
        return (
            <div className="container py-12">
                <h1 className="text-3xl font-bold mb-8">Our Products</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="space-y-4">
                            <Skeleton className="aspect-square rounded-lg" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    
    if (error) {
        console.error('GraphQL Error:', error);
        return (
            <div className="container py-12">
                <Alert variant="destructive">
                    <ExclamationTriangleIcon className="h-4 w-4" />
                    <AlertTitle>Error loading products</AlertTitle>
                    <AlertDescription>
                        {error.message}
                        {error.networkError && (
                            <p className="mt-2">Please check your API credentials and connection</p>
                        )}
                    </AlertDescription>
                </Alert>
            </div>
        );
    }
    
    const products = data?.products?.edges || [];
    
    return (
        <div className="container py-12">
            <Toaster 
                position="bottom-right"
                toastOptions={{
                    classNames: {
                        toast: "border border-border bg-background",
                        success: "border-l-4 border-l-green-500",
                        error: "border-l-4 border-l-red-500",
                    },
                    style: {
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    }
                }}
            />
            
            <div className="space-y-8">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Our Products</h1>
                    <p className="text-muted-foreground">
                        Discover our high-quality collection
                    </p>
                </div>
                
                {products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map(({ node: product }) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 gap-4">
                        <p className="text-muted-foreground">No products found</p>
                    </div>
                )}
            </div>
        </div>
    );
}