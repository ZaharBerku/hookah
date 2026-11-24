import { print } from "graphql";
import assert from "node:assert/strict";
import { resolve } from "node:path";
import { test } from "node:test";

import { load, src } from "./helpers/load-ts.mjs";

const { isAllowedGraphqlRequest } = load(
  resolve(src, "lib/graphqlAllowlist.ts")
);
const { CREATE_ORDER_MUTATION } = load(resolve(src, "query/order.ts"));
const query = print(CREATE_ORDER_MUTATION);

test("the public proxy does not expose order creation", () => {
  const variables = { data: { order: [{ odId: 169, quantity: 1 }] } };
  assert.equal(isAllowedGraphqlRequest(query, variables), false);
  assert.equal(
    isAllowedGraphqlRequest(
      "mutation { createOrder(data: { order: [] }) { data { id } } }"
    ),
    false
  );
});
