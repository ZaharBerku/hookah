import { gql } from "@apollo/client";

export const GET_FILTER_QUERY = gql`
  query GetFilterQuery($locale: I18NLocaleCode!, $category: String!) {
    filters(
      locale: $locale
      filters: { category: { name: { eq: $category } } }
    ) {
      data {
        attributes {
          filter
        }
      }
    }
  }
`;
