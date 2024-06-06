import { gql } from "@apollo/client";

export const GET_ALL_HOOKAH_PRODUCTS_QUERY = gql`
  query GetAllHookahProducts($locale: I18NLocaleCode!) {
    products(locale: $locale, filters: { category: { name: { eq: "hookah" } } }) {
      data {
        id
        attributes {
          odId
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

export const GET_ALL_HOOKAH_PRODUCT_IDS_QUERY = gql`
   query GetAllHookahProductIds($locale: I18NLocaleCode!) {
    products( filters: { category: { name: { eq: "hookah" } } }) {
      data {
        id
        attributes {
          odId
          name
        }
      }
    }
  }
`;

export const GET_HOOKAH_PRODUCT_QUERY = gql`
  query GetHookahProduct($locale: I18NLocaleCode!, $id: ID!) {
    product(locale: $locale, id: $id) {
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
          odId
          country
          likes
          name
          numberOf
          available
          price
          discount
          descriptions
          details
          gallery
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
