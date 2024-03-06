"use server";

import { HttpLink, ApolloClient, InMemoryCache } from "@apollo/client";
import { registerApolloClient } from "@apollo/experimental-nextjs-app-support/rsc";

const STRAPI_URL = process.env.STRAPI_URL || "http://127.0.0.1:1337";

export const { getClient } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: `${STRAPI_URL}/graphql`
    })
  });
});
