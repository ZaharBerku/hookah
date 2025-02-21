import { gql } from "@apollo/client";

import { BRAND_ATTRIBUTES_FRAGMENT } from "./fragments";

export const GET_BRAND_BY_SLUG_QUERY = gql`
  ${BRAND_ATTRIBUTES_FRAGMENT}
  query GetBrandBySlug($slug: String!, $slugType: String) {
    brands(
      filters: { slug: { eq: $slug }, types: { slugType: { eq: $slugType } } }
    ) {
      data {
        ...BrandAttributes
      }
    }
  }
`;

export const GET_ALL_BRANDS_QUERY = gql`
  ${BRAND_ATTRIBUTES_FRAGMENT}
  query GetAllBrands($category: String!) {
    brands(
      filters: { categories: { name: { eq: $category } } }
      pagination: { limit: 200 }
    ) {
      data {
        ...BrandAttributes
      }
    }
  }
`;

export const GET_BRANDS_BY_TYPE_SLUG_QUERY = gql`
  ${BRAND_ATTRIBUTES_FRAGMENT}
  query GetBrandsBySlugType($slugType: String!, $category: String!) {
    brands(
      filters: {
        types: { slugType: { eq: $slugType } }
        categories: { name: { eq: $category } }
      }
      pagination: { limit: 200 }
    ) {
      data {
        ...BrandAttributes
      }
    }
  }
`;
