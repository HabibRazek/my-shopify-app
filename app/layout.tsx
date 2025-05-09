import type { Metadata } from 'next';
import './globals.css';
import { ApolloWrapper } from '@/providers/ApolloProvider';
import { CartProvider } from '@/context/CartContext';
import NavBar from '@/components/NavBar';
import { Toaster } from 'sonner';

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
            <NavBar />
            <main className="pt-16"> {/* Add padding-top to account for fixed navbar */}
              {children}
              <Toaster position="bottom-center" />
            </main>
          </CartProvider>
        </ApolloWrapper>
      </body>
    </html>
  );
}