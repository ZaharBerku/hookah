import { gql } from "@apollo/client";

export const GET_ALL_HOOKAH_PRODUCTS_QUERY = gql`
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
