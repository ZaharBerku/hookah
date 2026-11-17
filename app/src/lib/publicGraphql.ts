import type { DocumentNode } from "graphql";
import { print } from "graphql";

export const PUBLIC_GRAPHQL_PATH = "/api/graphql";

export const queryPublicGraphql = async ({
  query,
  variables
}: {
  query: DocumentNode;
  variables?: Record<string, unknown>;
}) => {
  const response = await fetch(PUBLIC_GRAPHQL_PATH, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: print(query), variables })
  });
  const result = await response.json();
  if (!response.ok || result.errors?.length || !result.data) {
    throw new Error(`GraphQL request failed with status ${response.status}`);
  }
  return result.data;
};
