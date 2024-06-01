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
          previewImage {
            data {
              attributes {
                url
              }
            }
          }
          category {
            data {
              id
              attributes {
                name
              }
            }
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
