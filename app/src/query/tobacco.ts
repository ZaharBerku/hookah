import { gql } from "@apollo/client";

export const GET_ALL_TOBACCO_PRODUCTS_QUERY = gql`
   query GetAllTobaccoProducts($locale: I18NLocaleCode!, $limit: Int) {
    products(locale: $locale, filters: { category: { name: { eq: "tobacco" } } }, pagination: { limit: $limit }) {
      data {
        id
        attributes {
          odId
          previewImage {
            data {
              attributes {
                url
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

export const GET_ALL_TOBACCO_PRODUCT_IDS_QUERY = gql`
  query GetAllTobaccoProductIds($locale: I18NLocaleCode!) {
    products(locale: $locale, filters: { category: { name: { eq: "tobacco" } } }) {
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

export const GET_TOBACCO_PRODUCT_QUERY = gql`
  query GetProductById($locale: I18NLocaleCode!, $id: ID!) {
    product(locale: $locale, id: $id) {
      data {
        id
        attributes {
          odId
          previewImage {
            data {
              attributes {
                url
              }
            }
          }
          likes
          name
          numberOf
          price
          discount
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
            ... on ComponentProductsTobacco {
              tobacco {
                data {
                  id
                  attributes {
                    tasteChart
                    tastes {
                      data {
                        attributes {
                          name
                        }
                      }
                    }
                    weights {
                      data {
                        attributes {
                          size
                        }
                      }
                    }
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
