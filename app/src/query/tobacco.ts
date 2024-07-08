import { gql } from "@apollo/client";

import {
  PRODUCT_ATTRIBUTES_FRAGMENT,
  TOBACCO_PRODUCT_FRAGMENT
} from "./fragments";

export const GET_ALL_TOBACCO_PRODUCTS_QUERY = gql`
  ${PRODUCT_ATTRIBUTES_FRAGMENT}
  query GetAllTobaccoProducts($locale: I18NLocaleCode!, $limit: Int) {
    products(
      locale: $locale
      filters: { category: { name: { eq: "tobacco" } } }
      pagination: { limit: $limit }
    ) {
      data {
        ...ProductAttributes
      }
    }
  }
`;

export const GET_ALL_TOBACCO_PRODUCT_IDS_QUERY = gql`
  query GetAllTobaccoProductIds($locale: I18NLocaleCode!) {
    products(
      locale: $locale
      filters: { category: { name: { eq: "tobacco" } } }
    ) {
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

export const GET_TOBACCO_PRODUCT_BY_COMPOSITE_ID_QUERY = gql`
  ${PRODUCT_ATTRIBUTES_FRAGMENT}
  ${TOBACCO_PRODUCT_FRAGMENT}
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
            ...TobaccoProduct
          }
        }
      }
    }
  }
`;

export const GET_TOBACCO_PRODUCT_QUERY = gql`
  ${PRODUCT_ATTRIBUTES_FRAGMENT}
  ${TOBACCO_PRODUCT_FRAGMENT}
  query GetProductById($locale: I18NLocaleCode!, $id: ID!) {
    product(locale: $locale, id: $id) {
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
            ...TobaccoProduct
          }
        }
      }
    }
  }

`;
