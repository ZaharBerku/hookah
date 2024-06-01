import { gql } from "@apollo/client";

export const GET_ALL_TOBACCO_PRODUCTS_QUERY = gql`
  {
    products(filters: { category: { name: { eq: "tobacco" } } }) {
      data {
        id
        attributes {
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
  {
    products(filters: { category: { name: { eq: "tobacco" } } }) {
      data {
        id
        attributes {
          name
        }
      }
    }
  }
`;

export const GET_TOBACCO_PRODUCT_QUERY = gql`
  query GetProductById($id: ID!) {
    product(id: $id) {
      data {
        id
        attributes {
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
