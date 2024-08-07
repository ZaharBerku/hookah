import { gql } from "@apollo/client";

export const GET_TYPES_BY_CATEGORY_QUERY = gql`
  query GetTypes($category: String!) {
    types(
      filters: { categories: { name: { eq: $category } } }
      pagination: { limit: 40 }
    ) {
      data {
        id
        attributes {
          name
          slugType
          logo {
            data {
              attributes {
                url
              }
            }
          }
          categories {
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

export const GET_TYPES_BY_SLUG_QUERY = gql`
  query GetTypes($slug: String!) {
    types(filters: { slugType: { eq: $slug } }) {
      data {
        id
        attributes {
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
