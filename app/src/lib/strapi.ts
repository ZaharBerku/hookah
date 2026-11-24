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

const strapiFetch = (
  path: string,
  init: NonNullable<Parameters<typeof fetch>[1]>,
  timeoutMs: number
) => {
  const strapiUrl = process.env.STRAPI_URL || "http://127.0.0.1:1337";
  const token = process.env.API_TOKEN;
  return fetch(`${strapiUrl}${path}`, {
    ...init,
    cache: "no-store",
    signal: AbortSignal.timeout(timeoutMs),
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });
};

export const strapiGraphql = async <T = any>(
  query: DocumentNode,
  variables: Record<string, unknown>,
  timeoutMs = 3000
): Promise<StrapiGraphqlResponse<T>> => {
  const response = await strapiFetch(
    "/graphql",
    {
      method: "POST",
      body: JSON.stringify({ query: print(query), variables })
    },
    timeoutMs
  );
  return response.json();
};

export const markOrderNotified = async (orderId: string, timeoutMs = 2000) => {
  const response = await strapiFetch(
    `/api/orders/${encodeURIComponent(orderId)}/mark-notified`,
    { method: "POST" },
    timeoutMs
  );
  if (!response.ok) {
    throw new Error(`Strapi answered ${response.status} to mark-notified`);
  }
};
