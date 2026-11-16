"use client";

import { HttpLink, ApolloLink } from "@apollo/client";
import {
  ApolloClient,
  ApolloNextAppProvider,
  InMemoryCache,
  SSRMultipartLink
} from "@apollo/client-integration-nextjs";
import { PropsWithChildren } from "react";

import { PUBLIC_GRAPHQL_PATH } from "@/lib/publicGraphql";

function makeServerLink() {
  const STRAPI_URL = process.env.STRAPI_URL || "http://127.0.0.1:1337";
  const token = process.env.API_TOKEN;
  return ApolloLink.from([
    new SSRMultipartLink({
      stripDefer: true
    }),
    new HttpLink({
      uri: `${STRAPI_URL}/graphql`,
      headers: token ? { authorization: `Bearer ${token}` } : {},
      fetchOptions: { cache: "force-cache" }
    })
  ]);
}

function makeClient() {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link:
      typeof window === "undefined"
        ? makeServerLink()
        : new HttpLink({ uri: PUBLIC_GRAPHQL_PATH }),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "cache-and-network"
      },
      query: {
        fetchPolicy: "cache-first"
      }
    }
  });
}

export function ApolloWrapper({ children }: PropsWithChildren) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}
