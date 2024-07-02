import { gql } from "@apollo/client";

export const GET_BRAND_BY_SLUG_QUERY = gql`
  query GetBrandBySlug($slug: String!) {
    brands(filters: { slug: { eq: $slug } }) {
      data {
        attributes {
          logo {
            data {
              attributes {
                url
              }
            }
          }
          slug
          name
        }
      }
    }
  }
`;

export const GET_ALL_BRANDS_QUERY = gql`
  query GetAllBrands($category: String!) {
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
