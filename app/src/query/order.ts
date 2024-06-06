import { gql } from "@apollo/client";

export const CREATE_ORDER_MUTATION = gql`
  mutation CreateOrder($data: OrderInput!) {
    createOrder(data: $data) {
      data {
        attributes {
          name
          phoneNumber
          address
          status
          order
          department
          publishedAt
        }
      }
    }
  }
`;
