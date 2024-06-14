"use server";

import { HttpLink, ApolloClient, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { registerApolloClient } from "@apollo/experimental-nextjs-app-support/rsc";

import { getLocale } from "@/utils/helpers";

const STRAPI_URL = process.env.STRAPI_URL || "http://127.0.0.1:1337";

const token = process.env.API_TOKEN;

// Create an HttpLink
const httpLink = new HttpLink({
  uri: `${STRAPI_URL}/graphql`
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ""
    }
  };
});

// Combine authLink and httpLink
const link = authLink.concat(httpLink);

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
  return await getClient().query({
    query,
    variables: {
      locale,
      ...variables
    }
  });
};
