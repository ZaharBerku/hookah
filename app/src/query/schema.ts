import { gql } from "@apollo/client";

export const GET_ALL_PRODUCTS_QUERY = gql`
  {
    products {
      data {
        id
        attributes {
          country
          likes
          name
          numberOf
          available
          price
          discount
          descriptions
          colors {
            color
          }
        }
      }
    }
  }
`;

export const GET_PRODUCT_QUERY = gql`
  {
    products {
      data {
        id
        attributes {
          likes
          name
          numberOf
          available
          price
          discount
          colors {
            color
          }
          previewImage {
            data {
              attributes {
                caption
                previewUrl
              }
            }
          }
        }
      }
    }
  }
`;
