"use client";

import { HttpLink, ApolloLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import {
  NextSSRApolloClient,
  ApolloNextAppProvider,
  NextSSRInMemoryCache,
  SSRMultipartLink
} from "@apollo/experimental-nextjs-app-support/ssr";
import { PropsWithChildren } from "react";

import { PUBLIC_GRAPHQL_PATH } from "@/lib/publicGraphql";

function makeServerLink() {
  const STRAPI_URL = process.env.STRAPI_URL || "http://127.0.0.1:1337";
  const httpLink = new HttpLink({
    uri: `${STRAPI_URL}/graphql`
  });
  const authLink = setContext((_, { headers }) => {
    const token = process.env.API_TOKEN;
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : ""
      }
    };
  });
  return ApolloLink.from([
    new SSRMultipartLink({
      stripDefer: true
    }),
    authLink.concat(httpLink)
  ]);
}

function makeClient() {
  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
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
