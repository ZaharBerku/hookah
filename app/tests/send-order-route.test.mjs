import { print } from "graphql";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { test } from "node:test";

import { load, mocks, src } from "./helpers/load-ts.mjs";

const require = createRequire(import.meta.url);
const { NextRequest } = require("next/server");

let graphqlCalls = 0;
mocks.set("@/lib/strapi", {
  strapiGraphql: async () => {
    graphqlCalls += 1;
    return { errors: [{ message: "offline" }] };
  }
});
mocks.set("@/lib/telegram", { sendTelegramMessage: async () => {} });
let clientIp = "1.2.3.4";
mocks.set("@/utils/helpers/getClientIp", { getClientIp: () => clientIp });

const { POST } = load(resolve(src, "app/api/sendOrder/route.ts"));

const post = (body, headers = {}) =>
  POST(
    new NextRequest("http://localhost/api/sendOrder", {
      method: "POST",
      body,
      headers
    })
  );

test("oversized bodies are rejected before parsing", async () => {
  const response = await post(JSON.stringify({ pad: "x".repeat(25_000) }));
  assert.equal(response.status, 413);
  assert.equal(graphqlCalls, 0);
});

test("malformed JSON is a validation error", async () => {
  const response = await post("{not json");
  assert.equal(response.status, 400);
  assert.equal((await response.json()).error, "INVALID_ORDER");
});

const strapiResponse = (text, variables) => {
  if (text.includes("GetOrderByKey")) return { data: { orders: { data: [] } } };
  if (text.includes("GetOrderProducts")) {
    return {
      data: {
        products: {
          data: variables.compositeIds.map((compositeId) => ({
            id: "1",
            attributes: { compositeId, odId: 10, name: "Bamboo" }
          }))
        }
      }
    };
  }
  return orderOutcome();
};
let orderOutcome;
const validOrder = (index) =>
  JSON.stringify({
    name: "Ivan",
    lastName: "Petrenko",
    city: "Kyiv",
    phone: "+380 67 123 45 67",
    warehouses: "Branch 1",
    locale: "uk",
    idempotencyKey: `key-${String(index).padStart(10, "0")}`,
    items: [{ compositeId: "10-bamboo", quantity: 1 }]
  });
const accepted = () => ({
  data: {
    createOrder: {
      data: {
        id: "7",
        attributes: {
          name: "Ivan",
          phoneNumber: "+380 67 123 45 67",
          address: "Kyiv",
          department: "Branch 1",
          promocode: null,
          promocodeDiscount: 0,
          order: [{ name: "Bamboo", price: 300, discount: 0, quantity: 1 }]
        }
      }
    }
  }
});
const outOfStock = () => ({
  errors: [
    {
      message: "Not enough stock",
      extensions: {
        error: { details: { code: "OUT_OF_STOCK", items: [] } }
      }
    }
  ]
});

test("invalid requests never use up the rate limit", async () => {
  clientIp = "5.6.7.8";
  for (let index = 0; index < 12; index += 1) {
    assert.equal((await post("{}")).status, 400);
  }
});

test("only accepted orders count towards the limit of five per window", async () => {
  clientIp = "7.7.7.7";
  mocks.get("@/lib/strapi").strapiGraphql = async (query, variables) =>
    strapiResponse(print(query), variables);
  orderOutcome = outOfStock;
  for (let index = 0; index < 8; index += 1) {
    assert.equal((await post(validOrder(index))).status, 409);
  }
  orderOutcome = accepted;
  const statuses = [];
  for (let index = 100; index < 105; index += 1) {
    statuses.push((await post(validOrder(index))).status);
  }
  assert.deepEqual(statuses, [200, 200, 200, 200, 200]);
  const blocked = await post(validOrder(200));
  assert.equal(blocked.status, 429);
  assert.deepEqual(await blocked.json(), { error: "RATE_LIMITED" });
  assert.ok(Number(blocked.headers.get("retry-after")) > 0);
  clientIp = "9.9.9.9";
  assert.equal((await post(validOrder(300))).status, 200);
});
