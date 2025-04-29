// lib/apollo-client.ts
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'

const shopifyDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
const accessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN

if (!shopifyDomain || !accessToken) {
    throw new Error('Missing Shopify environment variables')
}

// Remove any accidental protocol or slashes
const cleanDomain = shopifyDomain
    .replace(/https?:\/\//, '')
    .replace(/\/$/, '')

export const apolloClient = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
        uri: `https://${cleanDomain}/api/2023-07/graphql.json`,
        headers: {
            'X-Shopify-Storefront-Access-Token': accessToken,
            'Content-Type': 'application/json'
        }
    })
})