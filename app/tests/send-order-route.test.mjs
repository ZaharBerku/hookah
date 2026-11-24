import { print } from "graphql";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { test } from "node:test";

import { load, mocks, src } from "./helpers/load-ts.mjs";

const require = createRequire(import.meta.url);
const { NextRequest } = require("next/server");

let graphqlCalls = 0;
const markCalls = [];
const telegramBatches = [];
mocks.set("@/lib/strapi", {
  strapiGraphql: async () => {
    graphqlCalls += 1;
    return { errors: [{ message: "offline" }] };
  },
  markOrderNotified: async (orderId, timeoutMs) => {
    markCalls.push({ orderId, timeoutMs });
  }
});
mocks.set("@/lib/telegram", {
  sendTelegramMessages: async (messages) => {
    telegramBatches.push(messages);
  }
});
let clientIp = "1.2.3.4";
mocks.set("@/utils/helpers/getClientIp", { getClientIp: () => clientIp });

const route = load(resolve(src, "app/api/sendOrder/route.ts"));
const { POST } = route;

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

let lookupOrders = [];
const strapiResponse = (text, variables) => {
  if (text.includes("GetOrderByKey")) {
    return { data: { orders: { data: lookupOrders } } };
  }
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
          lastName: "Petrenko",
          phoneNumber: "+380 67 123 45 67",
          address: "Kyiv",
          department: "Branch 1",
          promocode: null,
          promocodeDiscount: 0,
          notifiedAt: null,
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

test("the route declares an explicit duration limit", () => {
  assert.equal(route.maxDuration, 20);
});

test("accepted orders are marked notified with a short Strapi allowance", async () => {
  clientIp = "11.11.11.11";
  mocks.get("@/lib/strapi").strapiGraphql = async (query, variables) =>
    strapiResponse(print(query), variables);
  orderOutcome = accepted;
  lookupOrders = [];
  markCalls.length = 0;
  assert.equal((await post(validOrder(400))).status, 200);
  assert.deepEqual(markCalls, [{ orderId: "7", timeoutMs: 2000 }]);
});

test("replays count towards the limit exactly like new orders", async () => {
  clientIp = "12.12.12.12";
  const requests = [];
  mocks.get("@/lib/strapi").strapiGraphql = async (
    query,
    variables,
    timeout
  ) => {
    requests.push({ text: print(query), timeout });
    return strapiResponse(print(query), variables);
  };
  lookupOrders = [
    {
      ...accepted().data.createOrder.data,
      attributes: {
        ...accepted().data.createOrder.data.attributes,
        stockReserved: true,
        notifiedAt: "2026-01-02T03:04:05.000Z",
        requestHash: createHash("sha256")
          .update(
            JSON.stringify({
              items: [["10-bamboo", 1]],
              name: "Ivan",
              lastName: "Petrenko",
              city: "Kyiv",
              phone: "+380 67 123 45 67",
              warehouses: "Branch 1",
              promocode: null
            })
          )
          .digest("hex")
      }
    }
  ];
  telegramBatches.length = 0;
  const statuses = [];
  for (let index = 0; index < 5; index += 1) {
    statuses.push((await post(validOrder(500))).status);
  }
  assert.deepEqual(statuses, [200, 200, 200, 200, 200]);
  const lookupsBefore = requests.length;
  const blocked = await post(validOrder(500));
  assert.equal(blocked.status, 429);
  assert.equal(requests.length, lookupsBefore);
  assert.deepEqual(telegramBatches, []);
  lookupOrders = [];
});

test("the lookup after a failed create gets its own allowance", async () => {
  clientIp = "13.13.13.13";
  const timeouts = [];
  mocks.get("@/lib/strapi").strapiGraphql = async (
    query,
    variables,
    timeout
  ) => {
    const text = print(query);
    timeouts.push({
      kind: text.match(/(GetOrderByKey|GetOrderProducts|CreateOrder)/)[1],
      timeout
    });
    if (text.includes("CreateOrder")) throw new Error("aborted");
    return strapiResponse(text, variables);
  };
  assert.equal((await post(validOrder(600))).status, 502);
  const kinds = timeouts.map(({ kind }) => kind);
  assert.deepEqual(kinds, [
    "GetOrderByKey",
    "GetOrderProducts",
    "CreateOrder",
    "GetOrderByKey"
  ]);
  assert.ok(timeouts[0].timeout <= 3000);
  assert.equal(timeouts[3].timeout, 1500);
});
