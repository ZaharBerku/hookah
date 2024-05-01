import { gql } from "@apollo/client";

export const GET_ALL_PRODUCTS_QUERY = gql`
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
