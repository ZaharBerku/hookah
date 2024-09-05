import { gql } from "@apollo/client";

export const UPDATE_PROMOCODE = gql`
  mutation UpdatePromocode($id: ID!, $data: PromocodeInput!) {
    updatePromocode(id: $id, data: $data) {
      data {
        id
        attributes {
          name
          numberOfUses
          updatedAt
        }
      }
    }
  }
`;

export const CHECK_PROMOCODE = gql`
  query CheckPromocode($name: String!) {
    promocodes(filters: { name: { eq: $name } }) {
      data {
        id
        attributes {
          name
          discount
          dateStart
          dateEnd
          minAmount
          numberOfUses
        }
      }
    }
  }
`;
