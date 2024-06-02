"use client";

import { HttpLink, ApolloLink } from "@apollo/client";
import {
  NextSSRApolloClient,
  ApolloNextAppProvider,
  NextSSRInMemoryCache,
  SSRMultipartLink
} from "@apollo/experimental-nextjs-app-support/ssr";
import { PropsWithChildren } from "react";

const STRAPI_URL = process.env.STRAPI_URL || "http://127.0.0.1:1337";
function makeClient() {
  const httpLink = new HttpLink({
    uri: `${STRAPI_URL}/graphql`
  });
  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
    link:
      typeof window === "undefined"
        ? ApolloLink.from([
            new SSRMultipartLink({
              stripDefer: true
            }),
            httpLink
          ])
        : httpLink,
      defaultOptions: {
          watchQuery: {
              fetchPolicy: "cache-and-network",
          },
          query: {
              fetchPolicy: "cache-first",
          },
      },
  });
}

export function ApolloWrapper({ children }: PropsWithChildren) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}
