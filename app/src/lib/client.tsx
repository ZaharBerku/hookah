"use client";

import { InMemoryCache, ApolloClient, ApolloProvider } from "@apollo/client";
import { PropsWithChildren } from "react";

const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";

export function createApolloClient() {
  const client = new ApolloClient({
    uri: `${STRAPI_URL}/graphql`,
    cache: new InMemoryCache()
  });
  return client;
}
export const client = createApolloClient();

export function ApolloWrapper({ children }: PropsWithChildren) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
