import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const STOREFRONT_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

if (!SHOPIFY_DOMAIN || !STOREFRONT_TOKEN) {
  throw new Error('Missing required Shopify environment variables');
}

const httpLink = createHttpLink({
  uri: `https://${SHOPIFY_DOMAIN}/api/2024-01/graphql.json`,
  headers: {
    'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
    'Content-Type': 'application/json',
  }
});

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: 'network-only'
    }
  }
});