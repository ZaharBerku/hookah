import { gql } from "@apollo/client";

export const GET_ALL_PRODUCTS_QUERY = gql`
  {
    products {
      data {
        id
        attributes {
          category {
            data {
              id
            }
          }
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
          country
          name
          numberOf
          available
          price
          discount
          descriptions
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
