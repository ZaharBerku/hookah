import { HttpLink } from "@apollo/client";
import {
  ApolloClient,
  InMemoryCache,
  registerApolloClient
} from "@apollo/client-integration-nextjs";

import { getLocale } from "@/utils/helpers";

const STRAPI_URL = process.env.STRAPI_URL || "http://127.0.0.1:1337";

const token = process.env.API_TOKEN;

const link = new HttpLink({
  uri: `${STRAPI_URL}/graphql`,
  headers: token ? { authorization: `Bearer ${token}` } : {}
});

export const { getClient } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link,
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "cache-and-network"
      },
      query: {
        fetchPolicy: "cache-first"
      }
    }
  });
});

export const getQuery = async ({ params, query, variables }: any) => {
  const locale = getLocale(params);
  const result = await getClient().query<any>({
    query,
    variables: {
      locale,
      ...variables
    }
  });
  return { ...result, loading: false };
};
