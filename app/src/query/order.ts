import { gql } from "@apollo/client";

export const CREATE_ORDER_MUTATION = gql`
  mutation CreateOrder($data: OrderInput!) {
    createOrder(data: $data) {
      data {
        id
        attributes {
          name
          phoneNumber
          address
          status
          order
          department
          promocode
          promocodeDiscount
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
