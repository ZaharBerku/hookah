import type { DocumentNode } from "graphql";
import { print } from "graphql";

export type StrapiGraphqlError = {
  message: string;
  extensions?: { error?: { details?: unknown } };
};

export type StrapiGraphqlResponse<T = any> = {
  data?: T | null;
  errors?: StrapiGraphqlError[];
};

export const strapiGraphql = async <T = any>(
  query: DocumentNode,
  variables: Record<string, unknown>,
  timeoutMs = 3000
): Promise<StrapiGraphqlResponse<T>> => {
  const strapiUrl = process.env.STRAPI_URL || "http://127.0.0.1:1337";
  const token = process.env.API_TOKEN;
  const response = await fetch(`${strapiUrl}/graphql`, {
    method: "POST",
    cache: "no-store",
    signal: AbortSignal.timeout(timeoutMs),
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify({ query: print(query), variables })
  });
  return response.json();
};
