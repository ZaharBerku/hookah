import { gql } from "@apollo/client";

import {
  PRODUCT_ATTRIBUTES_FRAGMENT,
  BRAND_ATTRIBUTES_FRAGMENT
} from "./fragments";

export const GET_TOP_PRODUCTS_QUERY = gql`
  ${PRODUCT_ATTRIBUTES_FRAGMENT}
  query GetTopProducts(
    $locale: I18NLocaleCode!
    $filters: ProductFiltersInput
    $page: Int
  ) {
    products(
      locale: $locale
      sort: "likes:desc"
      pagination: { pageSize: 24, page: $page }
      filters: $filters
    ) {
      data {
        ...ProductAttributes
      }
      meta {
        pagination {
          pageCount
          total
          page
          pageSize
        }
      }
    }
  }
`;

export const GET_NEW_PRODUCTS_QUERY = gql`
  ${PRODUCT_ATTRIBUTES_FRAGMENT}
  query GetNewProducts(
    $locale: I18NLocaleCode!
    $filters: ProductFiltersInput
    $page: Int
  ) {
    products(
      locale: $locale
      sort: "createdAt:desc"
      pagination: { pageSize: 24, page: $page }
      filters: $filters
    ) {
      data {
        ...ProductAttributes
      }
      meta {
        pagination {
          pageCount
          total
          page
          pageSize
        }
      }
    }
  }
`;

export const GET_DISCOUNT_PRODUCTS_QUERY = gql`
  ${PRODUCT_ATTRIBUTES_FRAGMENT}
  query GetDiscountProducts(
    $locale: I18NLocaleCode!
    $filters: ProductFiltersInput
    $page: Int
  ) {
    products(
      locale: $locale
      filters: $filters
      sort: "discount:desc"
      pagination: { pageSize: 24, page: $page }
    ) {
      data {
        ...ProductAttributes
      }
      meta {
        pagination {
          pageCount
          total
          page
          pageSize
        }
      }
    }
  }
`;

export const GET_ALL_PRODUCTS_QUERY = gql`
  ${PRODUCT_ATTRIBUTES_FRAGMENT}
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
        ...ProductAttributes
      }
    }
    newProducts: products(
      locale: $locale
      sort: "createdAt:desc"
      pagination: { limit: $limit }
      filters: { numberOf: { gt: 0 } }
    ) {
      data {
        ...ProductAttributes
      }
    }
    discountProducts: products(
      locale: $locale
      filters: { discount: { gt: $discountLimit }, numberOf: { gt: 0 } }
      sort: "discount:desc"
      pagination: { limit: $limit }
    ) {
      data {
        ...ProductAttributes
      }
    }
  }
`;

export const GET_ALL_PRODUCTS_BY_NAME_QUERY = gql`
  ${PRODUCT_ATTRIBUTES_FRAGMENT}
  query GetAllProducts($locale: I18NLocaleCode!, $name: String!, $limit: Int) {
    products(
      locale: $locale
      pagination: { limit: $limit }
      filters: { name: { containsi: $name } }
    ) {
      data {
        ...ProductAttributes
      }
    }
  }
`;

export const GET_ALL_PRODUCTS_SITEMAP_QUERY = gql`
  ${PRODUCT_ATTRIBUTES_FRAGMENT}
  {
    products(locale: "uk", pagination: { limit: 900 }) {
      data {
        ...ProductAttributes
      }
    }
  }
`;

export const GET_PRODUCTS_BY_NAME_BRAND = gql`
  ${PRODUCT_ATTRIBUTES_FRAGMENT}
  ${BRAND_ATTRIBUTES_FRAGMENT}
  query GetProductByNameBrand(
    $locale: I18NLocaleCode!
    $brand: String!
    $limit: Int
  ) {
    products(
      locale: $locale
      filters: { brand: { slug: { eq: $brand } } }
      pagination: { limit: $limit }
      sort: ["numberOf:desc", "createdAt:desc"]
    ) {
      data {
        ...ProductAttributes
      }
    }
    brands(filters: { slug: { eq: $brand } }) {
      data {
        ...BrandAttributes
      }
    }
  }
`;

export const GET_CATEGORY_PRODUCTS_QUERY = gql`
  ${PRODUCT_ATTRIBUTES_FRAGMENT}
  ${BRAND_ATTRIBUTES_FRAGMENT}
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
        ...ProductAttributes
      }
    }
    brands(filters: { categories: { name: { eq: $category } } }) {
      data {
        ...BrandAttributes
      }
    }
  }
`;

export const SEARCH_PRODUCTS_QUERY = gql`
  ${PRODUCT_ATTRIBUTES_FRAGMENT}
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
        ...ProductAttributes
      }
    }
  }
`;

export const GET_PRODUCTS_QUERY = gql`
  ${PRODUCT_ATTRIBUTES_FRAGMENT}
  query GetProductsQuery(
    $locale: I18NLocaleCode!
    $filters: ProductFiltersInput
    $page: Int
  ) {
    products(
      locale: $locale
      filters: $filters
      pagination: { pageSize: 24, page: $page }
      sort: ["numberOf:desc", "createdAt:desc"]
    ) {
      data {
        ...ProductAttributes
      }
      meta {
        pagination {
          pageCount
          total
          page
          pageSize
        }
      }
    }
  }
`;

export const UPDATE_LIKES_MUTATION = gql`
  mutation UpdateProductLikes($odId: Int!, $data: ProductInput!) {
    updateProductByOdId(odId: $odId, data: $data) {
      data {
        attributes {
          likes
        }
      }
    }
  }
`;

export const GET_PRODUCTS_BY_COMPOSITE_ID_QUERY = gql`
  ${PRODUCT_ATTRIBUTES_FRAGMENT}
  query GetProductsByCompositeId(
    $locale: I18NLocaleCode!
    $compositeIds: [String]!
  ) {
    products(locale: $locale, filters: { compositeId: { in: $compositeIds } }) {
      data {
        ...ProductAttributes
      }
    }
  }
`;
