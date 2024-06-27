import { gql } from "@apollo/client";

export const GET_ALL_PRODUCTS_QUERY = gql`
  query GetAllProducts(
    $locale: I18NLocaleCode!
    $limit: Int
    $discountLimit: Long
  ) {
    topProducts: products(
      locale: $locale
      sort: "likes:desc"
      pagination: { limit: $limit }
      filters: { numberOf: { gt: 0 } }
    ) {
      data {
        id
        attributes {
          likes
          name
          numberOf
          price
          odId
          slug
          compositeId
          discount
          createdAt
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
    newProducts: products(
      locale: $locale
      sort: "createdAt:desc"
      pagination: { limit: $limit }
      filters: { numberOf: { gt: 0 } }
    ) {
      data {
        id
        attributes {
          likes
          name
          numberOf
          price
          odId
          slug
          compositeId
          discount
          createdAt
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
    discountProducts: products(
      locale: $locale
      filters: { discount: { gt: $discountLimit }, numberOf: { gt: 0 } }
      sort: "discount:desc"
      pagination: { limit: $limit }
    ) {
      data {
        id
        attributes {
          likes
          name
          numberOf
          price
          odId
          slug
          compositeId
          discount
          createdAt
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

export const GET_ALL_PRODUCTS_BY_NAME_QUERY = gql`
  query GetAllProducts($locale: I18NLocaleCode!, $name: String!, $limit: Int) {
    products(
      locale: $locale
      pagination: { limit: $limit }
      filters: { name: { containsi: $name } }
    ) {
      data {
        id
        attributes {
          likes
          name
          numberOf
          price
          odId
          slug
          compositeId
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
    products(locale: "uk", pagination: { limit: 200 }) {
      data {
        id
        attributes {
          odId
          slug
          compositeId
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
  query GetProductByCategory(
    $locale: I18NLocaleCode!
    $category: String!
    $brands: [ID]
    $limit: Int
  ) {
    products(
      locale: $locale
      filters: {
        category: { name: { eq: $category } }
        brand: { id: { in: $brands } }
      }
      pagination: { limit: $limit }
      sort: ["numberOf:desc", "createdAt:desc"]
    ) {
      data {
        id
        attributes {
          likes
          name
          odId
          compositeId
          slug
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

export const SEARCH_PRODUCTS_QUERY = gql`
  query SearchProductsQuery(
    $locale: I18NLocaleCode!
    $name: String!
    $limit: Int
  ) {
    products(
      locale: $locale
      filters: { name: { containsi: $name } }
      pagination: { limit: $limit }
      sort: ["name:asc"]
    ) {
      data {
        id
        attributes {
          likes
          name
          odId
          compositeId
          slug
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

export const FILTER_PRODUCTS_QUERY = gql`
  query FilterProductsQuery(
    $locale: I18NLocaleCode!
    $filters: ProductFiltersInput
    $limit: Int
  ) {
    products(
      locale: $locale
      filters: $filters
      pagination: { limit: $limit }
      sort: ["numberOf:desc", "createdAt:desc"]
    ) {
      data {
        id
        attributes {
          likes
          name
          odId
          compositeId
          slug
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
  }
`;

export const UPDATE_LIKES_MUTATION = gql`
  mutation UpdateProductLikes($odId: ID!, $data: ProductInput!) {
    updateByOdId(odId: $odId, data: $data) {
      data {
        id
        attributes {
          likes
        }
      }
    }
  }
`;
