import { gql } from "@apollo/client";

export const GET_ALL_PRODUCTS_QUERY = gql`
  {
    products {
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
    products {
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
  query GetProductByCategory($category: String!) {
    products(filters: { category: { name: { eq: $category } } }) {
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
