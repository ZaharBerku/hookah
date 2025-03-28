import { gql } from "@apollo/client";

import {
  PRODUCT_ATTRIBUTES_FRAGMENT // ACCESSORY_PRODUCT_FRAGMENT
} from "./fragments";

export const GET_ALL_ACCESSORY_PRODUCTS_QUERY = gql`
  ${PRODUCT_ATTRIBUTES_FRAGMENT}
  query GetAllAccessoryProducts($locale: I18NLocaleCode!, $limit: Int) {
    products(
      locale: $locale
      filters: { category: { name: { eq: "accessory" } } }
      pagination: { limit: $limit }
    ) {
      data {
        ...ProductAttributes
      }
    }
  }
`;

export const GET_ALL_ACCESSORY_PRODUCT_IDS_QUERY = gql`
  query GetAllAccessoryProductIds($locale: I18NLocaleCode!) {
    products(
      locale: $locale
      filters: { category: { name: { eq: "accessory" } } }
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

export const GET_ACCESSORY_PRODUCT_BY_COMPOSITE_ID_QUERY = gql`
  ${PRODUCT_ATTRIBUTES_FRAGMENT}
  query GetProductByCompositeId(
    $locale: I18NLocaleCode!
    $compositeId: String!
  ) {
    products(locale: $locale, filters: { compositeId: { eq: $compositeId } }) {
      data {
        attributes {
          descriptions
          details
          productOdId
          gallery {
            data {
              attributes {
                url
                previewUrl
                alternativeText
                formats
              }
            }
          }
          additionalInfo {
            ... on ComponentAdditionalColor {
              colors {
                data {
                  attributes {
                    name
                    imageColor {
                      data {
                        attributes {
                          url
                          previewUrl
                          alternativeText
                        }
                      }
                    }
                    color
                  }
                }
              }
            }
          }
        }
        ...ProductAttributes
      }
    }
  }
`;

export const GET_ACCESSORY_PRODUCT_QUERY = gql`
  ${PRODUCT_ATTRIBUTES_FRAGMENT}
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
                alternativeText
                formats
              }
            }
          }
          product {
            ...AccessoryProduct
          }
        }
      }
    }
  }
`;

export const GET_ACCESSORY_BY_PRODUCT_OD_ID_QUERY = gql`
  query GetAccessoryByProductOdId(
    $locale: I18NLocaleCode!
    $productOdId: Int!
  ) {
    products(
      locale: $locale
      filters: {
        productOdId: { eq: $productOdId }
        category: { name: { eq: "accessory" } }
      }
    ) {
      data {
        attributes {
          compositeId
          category {
            data {
              id
              attributes {
                name
              }
            }
          }
          brand {
            data {
              attributes {
                name
                slug
              }
            }
          }
          type {
            data {
              attributes {
                slugType
              }
            }
          }
          additionalInfo {
            ... on ComponentAdditionalColor {
              colors {
                data {
                  attributes {
                    name
                    imageColor {
                      data {
                        attributes {
                          previewUrl
                          url
                          alternativeText
                        }
                      }
                    }
                    color
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
