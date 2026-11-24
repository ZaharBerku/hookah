import { gql } from "@apollo/client";

export const CREATE_ORDER_MUTATION = gql`
  mutation CreateOrder($data: OrderInput!) {
    createOrder(data: $data) {
      data {
        id
        attributes {
          name
          lastName
          phoneNumber
          address
          status
          order
          department
          promocode
          promocodeDiscount
          notifiedAt
          publishedAt
        }
      }
    }
  }
`;

export const GET_ORDER_PRODUCTS_QUERY = gql`
  query GetOrderProducts($locale: I18NLocaleCode!, $compositeIds: [String]!) {
    products(
      locale: $locale
      filters: { compositeId: { in: $compositeIds } }
      pagination: { limit: 100 }
    ) {
      data {
        id
        attributes {
          compositeId
          odId
          name
        }
      }
    }
  }
`;

export const GET_ORDER_BY_KEY_QUERY = gql`
  query GetOrderByKey($key: String!) {
    orders(
      publicationState: PREVIEW
      filters: { idempotencyKey: { eq: $key } }
      pagination: { limit: 1 }
    ) {
      data {
        id
        attributes {
          name
          lastName
          phoneNumber
          address
          department
          order
          promocode
          promocodeDiscount
          requestHash
          stockReserved
          notifiedAt
          status
        }
      }
    }
  }
`;
