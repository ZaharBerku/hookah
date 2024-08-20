import { gql } from "@apollo/client";

export const GET_FILTER_QUERY = gql`
  query GetFilterQuery($locale: I18NLocaleCode!, $page: String!) {
    filters(locale: $locale, filters: { page: { eq: $page } }) {
      data {
        attributes {
          filter
        }
      }
    }
  }
`;
