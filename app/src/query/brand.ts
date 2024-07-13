import { gql } from "@apollo/client";

import { BRAND_ATTRIBUTES_FRAGMENT } from "./fragments";

export const GET_BRAND_BY_SLUG_QUERY = gql`
  ${BRAND_ATTRIBUTES_FRAGMENT}
  query GetBrandBySlug($slug: String!) {
    brands(filters: { slug: { eq: $slug } }) {
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
      pagination: { limit: 40 }
    ) {
      data {
        ...BrandAttributes
      }
    }
  }
`;
