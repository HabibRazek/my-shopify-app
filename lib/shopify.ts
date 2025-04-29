// import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk'
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

const httpLink = createHttpLink({
    uri: `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/api/2023-07/graphql.json`,
})

const authLink = setContext((_, { headers }) => {
    return {
        headers: {
            ...headers,
            'X-Shopify-Storefront-Access-Token': process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
        },
    }
})

export const shopifyClient = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
})