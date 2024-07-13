import { gql } from "@apollo/client";

import { PRODUCT_ATTRIBUTES_FRAGMENT, HOOKAH_PRODUCT_FRAGMENT } from "./fragments";

export const GET_ALL_HOOKAH_PRODUCTS_QUERY = gql`
  ${PRODUCT_ATTRIBUTES_FRAGMENT}
  query GetAllHookahProducts($locale: I18NLocaleCode!) {
    products(
      locale: $locale
      filters: { category: { name: { eq: "hookah" } } }
    ) {
      data {
        ...ProductAttributes
      }
    }
  }
`;

export const GET_ALL_HOOKAH_PRODUCT_IDS_QUERY = gql`
  query GetAllHookahProductIds($locale: I18NLocaleCode!) {
    products(filters: { category: { name: { eq: "hookah" } } }) {
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
  ${PRODUCT_ATTRIBUTES_FRAGMENT}
  query GetHookahProduct($locale: I18NLocaleCode!, $id: ID!) {
    product(locale: $locale, id: $id) {
      data {
        ...ProductAttributes
        attributes {
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

export const GET_HOOKAH_PRODUCT_BY_COMPOSITE_ID_QUERY = gql`
  ${PRODUCT_ATTRIBUTES_FRAGMENT}
  ${HOOKAH_PRODUCT_FRAGMENT}
  query GetProductByCompositeId(
    $locale: I18NLocaleCode!
    $compositeId: String!
  ) {
    products(locale: $locale, filters: { compositeId: { eq: $compositeId } }) {
      data {
        ...ProductAttributes
        attributes {
          descriptions
          details
          gallery {
            data {
              attributes {
                url
                previewUrl
              }
            }
          }
          product {
            ...HookahProduct
          }
        }
      }
    }
  }
`;
