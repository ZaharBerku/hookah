import { gql } from "@apollo/client";

export const GET_ALL_HOOKAH_PRODUCTS_QUERY = gql`
  {
    products(filters: { category: { name: { eq: "hookah" } } }) {
      data {
        id
        attributes {
          category {
            data {
              id
              attributes {
                name
              }
            }
          }
          country
          likes
          name
          numberOf
          available
          price
          discount
        }
      }
    }
  }
`;

export const GET_HOOKAH_PRODUCT_QUERY = gql`
  query GetProductById($id: ID!) {
    product(id: $id) {
      data {
        id
        attributes {
          category {
            data {
              id
              attributes {
                name
              }
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
          product {
            ... on ComponentProductsHookah {
              hookah {
                data {
                  id
                  attributes {
                    complete

                    diffuser
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
