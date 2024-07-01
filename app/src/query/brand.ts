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
