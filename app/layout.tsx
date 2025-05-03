import type { Metadata } from 'next';
import './globals.css';
import { ApolloWrapper } from '@/providers/ApolloProvider';
import { CartProvider } from '@/context/CartContext';


export const metadata: Metadata = {
  title: 'My Shopify Store',
  description: 'Next.js + Shopify Storefront',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ApolloWrapper>
          <CartProvider>
            {children}
          </CartProvider>
        </ApolloWrapper>
      </body>
    </html>
  );
}