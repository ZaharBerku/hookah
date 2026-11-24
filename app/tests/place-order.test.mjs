import { print } from "graphql";
import assert from "node:assert/strict";
import { resolve } from "node:path";
import { beforeEach, test } from "node:test";

import { load, src } from "./helpers/load-ts.mjs";

const { placeOrder } = load(resolve(src, "lib/placeOrder.ts"));
const { buildOrderMessage } = load(resolve(src, "lib/orderMessage.ts"));

const request = (overrides = {}) => ({
  name: "Ivan",
  lastName: "Petrenko",
  city: "Kyiv",
  phone: "+380 67 123 45 67",
  warehouses: "Branch 1",
  locale: "uk",
  items: [{ compositeId: "10-bamboo", quantity: 2 }],
  ...overrides
});

const products = [
  {
    id: "1",
    attributes: { compositeId: "10-bamboo", odId: 10, name: "Bamboo" }
  },
  {
    id: "2",
    attributes: { compositeId: "20-coal", odId: 20, name: "Coal" }
  }
];

const storedOrder = (overrides = {}) => ({
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
          order: [
            {
              odId: 10,
              name: "Bamboo",
              price: 300,
              discount: 10,
              quantity: 2,
              numberOf: 3
            }
          ],
          ...overrides
        }
      }
    }
  }
});

let calls;
let messages;
let createResponse;

const deps = (extra = {}) => ({
  graphql: async (query, variables) => {
    const text = print(query);
    calls.push({ text, variables });
    if (text.includes("GetOrderProducts")) {
      return { data: { products: { data: products } } };
    }
    return typeof createResponse === "function"
      ? createResponse(variables)
      : createResponse;
  },
  notify: async (message) => {
    messages.push(message);
  },
  now: () => new Date("2026-01-02T03:04:05.000Z"),
  ...extra
});

const created = () => calls.filter(({ text }) => text.includes("CreateOrder"));

beforeEach(() => {
  calls = [];
  messages = [];
  createResponse = storedOrder();
});

test("creates the order from database ids and notifies from the stored order", async () => {
  const result = await placeOrder(
    request({
      items: [
        { compositeId: "10-bamboo", quantity: 2, price: 1, name: "Fake" }
      ],
      amount: 1,
      amountWithDiscount: 1
    }),
    deps()
  );
  assert.deepEqual(result, { status: 200, body: { ok: true, notified: true } });
  assert.equal(created().length, 1);
  assert.deepEqual(created()[0].variables.data, {
    name: "Ivan",
    phoneNumber: "+380 67 123 45 67",
    address: "Kyiv",
    department: "Branch 1",
    order: [{ id: "1", odId: 10, quantity: 2 }],
    promocode: null,
    publishedAt: "2026-01-02T03:04:05.000Z"
  });
  assert.equal(messages.length, 1);
  assert.match(messages[0], /\*Назва:\* Bamboo/);
  assert.match(messages[0], /\*Ціна:\*  300грн/);
  assert.match(messages[0], /\*Знижка:\* 10%/);
  assert.match(messages[0], /Загальна сума:\* 600 грн/);
  assert.match(messages[0], /Загальна сума зі знижкою:\* 540 грн/);
  assert.doesNotMatch(messages[0], /Fake/);
});

test("duplicate cart lines are merged before ordering", async () => {
  await placeOrder(
    request({
      items: [
        { compositeId: "10-bamboo", quantity: 1 },
        { compositeId: "10-bamboo", quantity: 2 }
      ]
    }),
    deps()
  );
  assert.deepEqual(created()[0].variables.data.order, [
    { id: "1", odId: 10, quantity: 3 }
  ]);
});

test("the promocode name is forwarded and its stored discount is reported", async () => {
  createResponse = storedOrder({ promocode: "SALE", promocodeDiscount: 20 });
  await placeOrder(request({ promocode: "SALE" }), deps());
  assert.equal(created()[0].variables.data.promocode, "SALE");
  assert.match(messages[0], /\*Промокод:\* SALE/);
  assert.match(messages[0], /\*Знижка промокода:\* 20%/);
});

test("insufficient stock reports the products and sends nothing", async () => {
  createResponse = {
    errors: [
      {
        message: "Not enough stock for: Bamboo",
        extensions: {
          error: {
            details: {
              code: "OUT_OF_STOCK",
              items: [{ odId: 10, name: "Bamboo", requested: 2, available: 1 }]
            }
          }
        }
      }
    ]
  };
  const result = await placeOrder(request(), deps());
  assert.deepEqual(result, {
    status: 409,
    body: {
      error: "OUT_OF_STOCK",
      items: [{ compositeId: "10-bamboo", name: "Bamboo", available: 1 }]
    }
  });
  assert.deepEqual(messages, []);
});

test("products missing from the catalogue block the order before it is created", async () => {
  const result = await placeOrder(
    request({
      items: [
        { compositeId: "10-bamboo", quantity: 1 },
        { compositeId: "99-gone", quantity: 1 }
      ]
    }),
    deps()
  );
  assert.equal(result.status, 409);
  assert.deepEqual(result.body.items, [
    { compositeId: "99-gone", name: null, available: 0, missing: true }
  ]);
  assert.equal(created().length, 0);
  assert.deepEqual(messages, []);
});

test("a rejected promocode maps to a clear error and sends nothing", async () => {
  createResponse = {
    errors: [
      {
        message: "Promocode is not valid",
        extensions: { error: { details: { code: "PROMOCODE_INVALID" } } }
      }
    ]
  };
  const result = await placeOrder(request({ promocode: "OLD" }), deps());
  assert.deepEqual(result, {
    status: 422,
    body: { error: "PROMOCODE_INVALID" }
  });
  assert.deepEqual(messages, []);
});

test("malformed requests never reach Strapi or Telegram", async () => {
  const invalid = [
    null,
    "x",
    request({ items: [] }),
    request({ items: [{ compositeId: "10-bamboo", quantity: 0 }] }),
    request({ items: [{ compositeId: "10-bamboo", quantity: 1.5 }] }),
    request({ items: [{ compositeId: "", quantity: 1 }] }),
    request({ phone: "123" }),
    request({ name: "   " }),
    request({ locale: "en" }),
    request({ items: undefined })
  ];
  for (const input of invalid) {
    const result = await placeOrder(input, deps());
    assert.deepEqual(result, { status: 400, body: { error: "INVALID_ORDER" } });
  }
  assert.deepEqual(calls, []);
  assert.deepEqual(messages, []);
});

test("an unreachable or erroring Strapi sends nothing", async () => {
  const down = await placeOrder(
    request(),
    deps({
      graphql: async () => {
        throw new Error("offline");
      }
    })
  );
  assert.deepEqual(down, { status: 502, body: { error: "UPSTREAM_ERROR" } });

  createResponse = { errors: [{ message: "Forbidden" }] };
  const forbidden = await placeOrder(request(), deps());
  assert.deepEqual(forbidden, {
    status: 502,
    body: { error: "UPSTREAM_ERROR" }
  });
  assert.deepEqual(messages, []);
});

test("a Telegram failure does not fail an order that was recorded", async (t) => {
  t.mock.method(console, "error", () => {});
  const result = await placeOrder(
    request(),
    deps({
      notify: async () => {
        throw new Error("telegram down");
      }
    })
  );
  assert.deepEqual(result, {
    status: 200,
    body: { ok: true, notified: false }
  });
});

test("the message keeps the layout the owner receives", () => {
  const message = buildOrderMessage({
    firstName: "Ivan",
    lastName: "Petrenko",
    city: "Kyiv",
    phone: "+380 67 123 45 67",
    warehouse: "Branch 1",
    items: [{ name: "Bamboo", price: 300, discount: 10, quantity: 2 }]
  });
  assert.equal(
    message,
    `
    🔔 *Нове замовлення*

    👤 *Ім'я:* Petrenko Ivan
    🏙️ *Місто:* Kyiv
    📞 *Телефон:* +380 67 123 45 67
    🏢 *Відділення:* Branch 1
    ----------------------
    🛒 *Замовлення:*
        ----------------------
            1️⃣ *Назва:* Bamboo
                 *Кількість:* 2
                 *Ціна:*  300грн
                 *Знижка:* 10%
                ----------------------
      ----------------------
      *Промокод:* Відсутній
      *Знижка промокода:* 0%
      💵 *Загальна сума:* 600 грн
      💵 *Загальна сума зі знижкою:* 540 грн
    `
  );
});
