// graphql/queries.ts
import { gql } from '@apollo/client';

// Product Queries
export const GET_PRODUCTS = gql`
  query GetProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          description
          handle
          featuredImage {
            url
          }
          variants(first: 1) {
            edges {
              node {
                id
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_PRODUCT_BY_HANDLE = gql`
  query GetProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      description
      featuredImage {
        url
        altText
        width
        height
      }
      variants(first: 10) {
        edges {
          node {
            id
            title
            availableForSale
            price {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

export const GET_PRODUCT_BY_ID = gql`
  query GetProductById($id: ID!) {
    product(id: $id) {
      id
      title
      description
      featuredImage {
        url
      }
      variants(first: 1) {
        edges {
          node {
            id
            price {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

export const GET_ALL_PRODUCTS = gql`
  query GetAllProducts {
    products(first: 250) {
      edges {
        node {
          id
          title
          handle
          description
          featuredImage {
            url
            altText
          }
          variants(first: 1) {
            edges {
              node {
                id
                availableForSale
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  }
`;

// Order and Checkout Mutations
export const CREATE_DRAFT_ORDER = gql`
  mutation draftOrderCreate($input: DraftOrderInput!) {
    draftOrderCreate(input: $input) {
      draftOrder {
        id
        order {
          id
          name
          totalPrice {
            amount
            currencyCode
          }
          customerLocale
          fulfillmentStatus
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const COMPLETE_DRAFT_ORDER = gql`
  mutation CompleteDraftOrder($id: ID!) {
    draftOrderComplete(id: $id) {
      draftOrder {
        order {
          id
          name
          statusUrl
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const CREATE_ORDER_FROM_CART = gql`
  mutation CreateOrderFromCart($input: DraftOrderInput!) {
    draftOrderCreate(input: $input) {
      draftOrder {
        id
        order {
          id
          name
          statusUrl
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// Order Queries
export const GET_ORDER_BY_ID = gql`
  query GetOrderById($id: ID!) {
    order(id: $id) {
      id
      name
      email
      createdAt
      fulfillmentStatus
      financialStatus
      totalPrice {
        amount
        currencyCode
      }
      shippingAddress {
        name
        address1
        address2
        city
        province
        country
        zip
        phone
      }
      lineItems(first: 10) {
        edges {
          node {
            title
            quantity
            variant {
              title
              price {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_ORDERS_BY_EMAIL = gql`
  query GetOrdersByEmail($email: String!, $first: Int = 5) {
    orders(first: $first, query: $email) {
      edges {
        node {
          id
          name
          createdAt
          fulfillmentStatus
          financialStatus
          totalPrice {
            amount
            currencyCode
          }
          lineItems(first: 3) {
            edges {
              node {
                title
                quantity
              }
            }
          }
        }
      }
    }
  }
`;

// Customer Queries
export const GET_CUSTOMER_BY_EMAIL = gql`
  query GetCustomerByEmail($email: String!) {
    customers(first: 1, query: $email) {
      edges {
        node {
          id
          firstName
          lastName
          email
          phone
          addresses {
            address1
            address2
            city
            province
            country
            zip
          }
        }
      }
    }
  }
`;

// Inventory Check Query
export const CHECK_INVENTORY = gql`
  query CheckInventory($variantId: ID!) {
    productVariant(id: $variantId) {
      id
      inventoryQuantity
      currentlyNotInStock
    }
  }
`;



export const DEBUG_PRODUCTS = gql`
  query DebugProducts {
    products(first: 10) {
      edges {
        node {
          id
          title
          handle
          availableForSale
        }
      }
    }
  }
`;