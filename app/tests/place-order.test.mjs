import { print } from "graphql";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { beforeEach, test } from "node:test";

import { load, src } from "./helpers/load-ts.mjs";

const { placeOrder } = load(resolve(src, "lib/placeOrder.ts"));
const { buildOrderMessage } = load(resolve(src, "lib/orderMessage.ts"));
const { MarkdownV2Parser } = createRequire(import.meta.url)(
  "telegram/extensions/markdownv2"
);

const request = (overrides = {}) => ({
  name: "Ivan",
  lastName: "Petrenko",
  city: "Kyiv",
  phone: "+380 67 123 45 67",
  warehouses: "Branch 1",
  locale: "uk",
  idempotencyKey: "key-1234567890",
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

const legacyProduct = {
  id: "3",
  attributes: { compositeId: "30-legacy", odId: null, name: "Legacy" }
};

const hashOf = (entries) =>
  createHash("sha256").update(JSON.stringify(entries)).digest("hex");
const bambooHash = hashOf([["10-bamboo", 2]]);

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
          requestHash: bambooHash,
          stockReserved: true,
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
let catalogue;
let lookupResponse;

const deps = (extra = {}) => ({
  graphql: async (query, variables) => {
    const text = print(query);
    calls.push({ text, variables });
    if (text.includes("GetOrderByKey")) {
      return typeof lookupResponse === "function"
        ? lookupResponse()
        : lookupResponse;
    }
    if (text.includes("GetOrderProducts")) {
      const wanted = new Set(variables.compositeIds);
      return {
        data: {
          products: {
            data: catalogue[variables.locale].filter(({ attributes }) =>
              wanted.has(attributes.compositeId)
            )
          }
        }
      };
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
const noOrderFound = { data: { orders: { data: [] } } };

beforeEach(() => {
  calls = [];
  messages = [];
  createResponse = storedOrder();
  catalogue = {
    uk: [...products, legacyProduct],
    ru: [...products, legacyProduct]
  };
  lookupResponse = noOrderFound;
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
    order: [{ id: "1", compositeId: "10-bamboo", odId: 10, quantity: 2 }],
    promocode: null,
    idempotencyKey: "key-1234567890",
    requestHash: bambooHash,
    publishedAt: "2026-01-02T03:04:05.000Z"
  });
  assert.equal(messages.length, 1);
  assert.match(messages[0], /^\n\s+№ 7\n\s+🔔 \*Нове замовлення\*/);
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
    { id: "1", compositeId: "10-bamboo", odId: 10, quantity: 3 }
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
              items: [
                {
                  compositeId: "10-bamboo",
                  odId: 10,
                  name: "Bamboo",
                  requested: 2,
                  available: 1
                }
              ]
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
    request({ items: undefined }),
    request({ idempotencyKey: undefined }),
    request({ idempotencyKey: "short" }),
    request({ idempotencyKey: "not valid because of spaces" })
  ];
  for (const input of invalid) {
    const result = await placeOrder(input, deps());
    assert.equal(result.status, 400);
    assert.equal(result.body.error, "INVALID_ORDER");
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
  assert.match(console.error.mock.calls[0].arguments[0], /Order 7 /);
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

test("the order number is the only addition to the owner message", () => {
  const input = {
    firstName: "Ivan",
    lastName: "Petrenko",
    city: "Kyiv",
    phone: "+380 67 123 45 67",
    warehouse: "Branch 1",
    items: [{ name: "Bamboo", price: 300, discount: 10, quantity: 2 }]
  };
  const plain = buildOrderMessage(input);
  const numbered = buildOrderMessage({ ...input, orderId: "123" });
  assert.equal(numbered, plain.replace("\n    🔔", "\n    № 123\n    🔔"));
  assert.ok(numbered.startsWith("\n    № 123\n    🔔"));
});

test("products without an odId are ordered by compositeId", async () => {
  await placeOrder(
    request({ items: [{ compositeId: "30-legacy", quantity: 1 }] }),
    deps()
  );
  assert.deepEqual(created()[0].variables.data.order, [
    { id: "3", compositeId: "30-legacy", odId: null, quantity: 1 }
  ]);
});

test("a product that exists only in the other locale can still be ordered", async () => {
  catalogue.ru = [products[1]];
  const result = await placeOrder(request({ locale: "ru" }), deps());
  assert.equal(result.status, 200);
  assert.deepEqual(created()[0].variables.data.order, [
    { id: "1", compositeId: "10-bamboo", odId: 10, quantity: 2 }
  ]);
});

test("a product missing in every locale is reported as missing", async () => {
  catalogue = { uk: [], ru: [] };
  const result = await placeOrder(request(), deps());
  assert.equal(result.status, 409);
  assert.equal(result.body.items[0].missing, true);
  assert.equal(created().length, 0);
});

test("limits on lines and units are enforced and name the cart", async () => {
  const lines = Array.from({ length: 21 }, (_, index) => ({
    compositeId: `p-${index}`,
    quantity: 1
  }));
  const tooMany = await placeOrder(request({ items: lines }), deps());
  const tooMuch = await placeOrder(
    request({ items: [{ compositeId: "10-bamboo", quantity: 21 }] }),
    deps()
  );
  const mergedTooMuch = await placeOrder(
    request({
      items: [
        { compositeId: "10-bamboo", quantity: 12 },
        { compositeId: "10-bamboo", quantity: 12 }
      ]
    }),
    deps()
  );
  for (const result of [tooMany, tooMuch, mergedTooMuch]) {
    assert.equal(result.status, 400);
    assert.deepEqual(result.body.fields, ["items"]);
  }
  const contact = await placeOrder(request({ name: "x".repeat(101) }), deps());
  assert.deepEqual(contact.body.fields, ["name"]);
  assert.deepEqual(calls, []);
});

test("an order with a known idempotency key is returned without reserving again", async () => {
  lookupResponse = {
    data: {
      orders: { data: [storedOrder().data.createOrder.data] }
    }
  };
  const result = await placeOrder(request(), deps());
  assert.deepEqual(result, { status: 200, body: { ok: true, notified: true } });
  assert.equal(created().length, 0);
  assert.equal(
    calls.some(({ text }) => text.includes("GetOrderProducts")),
    false
  );
  assert.equal(messages.length, 1);
});

test("a duplicate key rejected by Strapi resolves to the order that won the race", async () => {
  let lookups = 0;
  lookupResponse = () => {
    lookups += 1;
    return lookups === 1
      ? noOrderFound
      : { data: { orders: { data: [storedOrder().data.createOrder.data] } } };
  };
  createResponse = {
    errors: [{ message: "This attribute must be unique" }]
  };
  const result = await placeOrder(request(), deps());
  assert.deepEqual(result, { status: 200, body: { ok: true, notified: true } });
  assert.equal(created().length, 1);
});

test("a replay with a different item set is a conflict and creates nothing", async () => {
  lookupResponse = {
    data: { orders: { data: [storedOrder().data.createOrder.data] } }
  };
  const result = await placeOrder(
    request({ items: [{ compositeId: "10-bamboo", quantity: 3 }] }),
    deps()
  );
  assert.deepEqual(result, {
    status: 409,
    body: { error: "IDEMPOTENCY_CONFLICT" }
  });
  assert.equal(created().length, 0);
  assert.deepEqual(messages, []);
});

test("the same items in another order or split across lines are the same request", async () => {
  lookupResponse = {
    data: {
      orders: {
        data: [
          storedOrder({
            requestHash: hashOf([
              ["10-bamboo", 3],
              ["20-coal", 1]
            ])
          }).data.createOrder.data
        ]
      }
    }
  };
  const result = await placeOrder(
    request({
      items: [
        { compositeId: "20-coal", quantity: 1 },
        { compositeId: "10-bamboo", quantity: 1 },
        { compositeId: "10-bamboo", quantity: 2 }
      ]
    }),
    deps()
  );
  assert.equal(result.status, 200);
});

test("an order whose stock is not reserved yet is not replayed", async () => {
  lookupResponse = {
    data: {
      orders: {
        data: [storedOrder({ stockReserved: false }).data.createOrder.data]
      }
    }
  };
  const result = await placeOrder(request(), deps());
  assert.deepEqual(result, {
    status: 409,
    body: { error: "ORDER_IN_PROGRESS" }
  });
  assert.equal(created().length, 0);
  assert.deepEqual(messages, []);

  lookupResponse = {
    data: {
      orders: {
        data: [storedOrder({ stockReserved: null }).data.createOrder.data]
      }
    }
  };
  assert.equal((await placeOrder(request(), deps())).status, 409);
});

test("a duplicate key whose winner is still reserving answers retry-later", async () => {
  let lookups = 0;
  lookupResponse = () => {
    lookups += 1;
    return lookups === 1
      ? noOrderFound
      : {
          data: {
            orders: {
              data: [
                storedOrder({ stockReserved: false }).data.createOrder.data
              ]
            }
          }
        };
  };
  createResponse = { errors: [{ message: "Internal Server Error" }] };
  const result = await placeOrder(request(), deps());
  assert.equal(result.status, 409);
  assert.equal(result.body.error, "ORDER_IN_PROGRESS");
  assert.deepEqual(messages, []);
});

const limiter = (allowed = true) => {
  const state = { acquired: 0, released: 0 };
  return {
    state,
    rateLimit: () => {
      state.acquired += 1;
      let released = false;
      return {
        allowed,
        retryAfterSeconds: 42,
        release: () => {
          if (released) return;
          released = true;
          state.released += 1;
        }
      };
    }
  };
};

test("an accepted order counts towards the rate limit", async () => {
  const { state, rateLimit } = limiter();
  const result = await placeOrder(request(), deps({ rateLimit }));
  assert.equal(result.status, 200);
  assert.deepEqual(state, { acquired: 1, released: 0 });
});

test("invalid requests and replays never touch the rate limit", async () => {
  const { state, rateLimit } = limiter();
  await placeOrder(request({ phone: "123" }), deps({ rateLimit }));
  await placeOrder(
    request({ items: [{ compositeId: "10-bamboo", quantity: 25 }] }),
    deps({ rateLimit })
  );
  lookupResponse = {
    data: { orders: { data: [storedOrder().data.createOrder.data] } }
  };
  await placeOrder(request(), deps({ rateLimit }));
  await placeOrder(
    request({ items: [{ compositeId: "20-coal", quantity: 1 }] }),
    deps({ rateLimit })
  );
  assert.equal(state.acquired, 0);
});

test("rejected attempts give their rate limit slot back", async () => {
  const { state, rateLimit } = limiter();
  catalogue = { uk: [], ru: [] };
  await placeOrder(request(), deps({ rateLimit }));
  catalogue = { uk: products, ru: products };
  createResponse = {
    errors: [
      {
        message: "Not enough stock for: Bamboo",
        extensions: {
          error: {
            details: { code: "OUT_OF_STOCK", items: [] }
          }
        }
      }
    ]
  };
  await placeOrder(request(), deps({ rateLimit }));
  createResponse = { errors: [{ message: "Forbidden" }] };
  await placeOrder(request(), deps({ rateLimit }));
  assert.deepEqual(state, { acquired: 3, released: 3 });
});

test("a duplicate-key race resolved to the winning order does not count", async () => {
  const { state, rateLimit } = limiter();
  let lookups = 0;
  lookupResponse = () => {
    lookups += 1;
    return lookups === 1
      ? noOrderFound
      : { data: { orders: { data: [storedOrder().data.createOrder.data] } } };
  };
  createResponse = { errors: [{ message: "This attribute must be unique" }] };
  const result = await placeOrder(request(), deps({ rateLimit }));
  assert.equal(result.status, 200);
  assert.deepEqual(state, { acquired: 1, released: 1 });
});

test("a blocked address gets a retry hint and nothing is looked up or created", async () => {
  const { rateLimit } = limiter(false);
  const result = await placeOrder(request(), deps({ rateLimit }));
  assert.deepEqual(result, {
    status: 429,
    body: { error: "RATE_LIMITED" },
    headers: { "Retry-After": "42" }
  });
  assert.equal(created().length, 0);
  assert.equal(
    calls.some(({ text }) => text.includes("GetOrderProducts")),
    false
  );
});

test("a failing lookup does not block the order", async (t) => {
  t.mock.method(console, "error", () => {});
  lookupResponse = () => {
    throw new Error("forbidden");
  };
  const result = await placeOrder(request(), deps());
  assert.equal(result.status, 200);
  assert.equal(created().length, 1);
});

test("customer text cannot inject links or formatting into the owner message", () => {
  const hostile = [
    '<a href="https://evil.example">Pay</a>',
    "[Pay](https://evil.example)",
    "*bold* __under__ ~strike~ `code` ||spoiler||",
    "Івано-Франківськ - вул. Нова-1, - 5"
  ];
  const message = buildOrderMessage({
    firstName: hostile[0],
    lastName: hostile[1],
    city: hostile[3],
    phone: "+380 67 123 45 67",
    warehouse: hostile[2],
    items: [{ name: hostile[0], price: 10, discount: 0, quantity: 1 }],
    promocode: hostile[1]
  });
  const [text, entities] = MarkdownV2Parser.parse(message);
  const visible = entities.filter(({ length }) => length > 0);
  assert.ok(
    visible.every(({ className }) => className === "MessageEntityBold")
  );
  for (const entity of visible) {
    const label = text.slice(entity.offset, entity.offset + entity.length);
    assert.match(label, /:$|^Нове замовлення$/);
  }
  for (const value of hostile) assert.ok(text.includes(value), value);
});

test("an unremarkable name keeps its entities and text", () => {
  const [text, entities] = MarkdownV2Parser.parse(
    buildOrderMessage({
      firstName: "Ivan",
      lastName: "Petrenko",
      city: "Kyiv",
      phone: "+380 67 123 45 67",
      warehouse: "Branch 1",
      items: [{ name: "Bamboo", price: 300, discount: 10, quantity: 2 }]
    })
  );
  assert.ok(text.includes("Petrenko Ivan"));
  assert.ok(
    entities
      .filter(({ length }) => length > 0)
      .every(({ className }) => className === "MessageEntityBold")
  );
});
