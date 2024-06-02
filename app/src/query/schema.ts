import { gql } from "@apollo/client";

export const GET_ALL_PRODUCTS_QUERY = gql`
  query GetAllProducts($locale: I18NLocaleCode!) {
    products(locale: $locale) {
      data {
        id
        attributes {
          likes
          name
          numberOf
          price
          discount
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

export const GET_ALL_PRODUCTS_SITEMAP_QUERY = gql`
    {
     productsUk: products(locale: "uk") {
      data {
        id
        attributes {
          name
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
    productsRu: products(locale: "ru") {
      data {
        id
        attributes {
          name
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

export const GET_CATEGORY_PRODUCTS_QUERY = gql`
  query GetProductByCategory($locale: I18NLocaleCode!, $category: String!) {
    products(locale: $locale, filters: { category: { name: { eq: $category } } }) {
      data {
        id
        attributes {
          likes
          name
          numberOf
          price
          discount
          category {
            data {
              id
              attributes {
                name
              }
            }
          }
          previewImage {
            data {
              attributes {
                url
              }
            }
          }
        }
      }
    }
    brands(filters: { categories: { name: { eq: $category } } }) {
      data {
        id
        attributes {
          name
          logo {
            data {
              attributes {
                url
              }
            }
          }
        }
      }
    }
  }
`;
