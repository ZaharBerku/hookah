import { print } from "graphql";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { beforeEach, test } from "node:test";

import { load, src } from "./helpers/load-ts.mjs";

const { placeOrder } = load(resolve(src, "lib/placeOrder.ts"));
const { buildOrderMessages } = load(resolve(src, "lib/orderMessage.ts"));

const buildOrderMessage = (input) => {
  const [message, ...rest] = buildOrderMessages(input);
  assert.deepEqual(rest, []);
  return message;
};
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

const hashOf = (entries, overrides = {}) =>
  createHash("sha256")
    .update(
      JSON.stringify({
        items: entries,
        name: "Ivan",
        lastName: "Petrenko",
        city: "Kyiv",
        phone: "+380 67 123 45 67",
        warehouses: "Branch 1",
        promocode: null,
        ...overrides
      })
    )
    .digest("hex");
const bambooHash = hashOf([["10-bamboo", 2]]);

const storedOrder = (overrides = {}) => ({
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
          requestHash: bambooHash,
          stockReserved: true,
          notifiedAt: null,
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
let notifications;
let marked;
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
  notify: async (parts) => {
    notifications.push(parts);
    messages.push(...parts);
  },
  markNotified: async (orderId) => {
    marked.push(orderId);
  },
  now: () => new Date("2026-01-02T03:04:05.000Z"),
  ...extra
});

const created = () => calls.filter(({ text }) => text.includes("CreateOrder"));
const noOrderFound = { data: { orders: { data: [] } } };

beforeEach(() => {
  calls = [];
  messages = [];
  notifications = [];
  marked = [];
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
    lastName: "Petrenko",
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
  assert.deepEqual(marked, ["7"]);
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
  assert.match(
    console.error.mock.calls[0].arguments[0],
    /Order 7 not notified/
  );
  assert.deepEqual(marked, []);
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
    body: { error: "IDEMPOTENCY_CONFLICT", orderId: "7" }
  });
  assert.equal(created().length, 0);
  assert.equal(messages.length, 1);
  assert.deepEqual(marked, ["7"]);
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

test("invalid requests never touch the rate limit", async () => {
  const { state, rateLimit } = limiter();
  await placeOrder(request({ phone: "123" }), deps({ rateLimit }));
  await placeOrder(
    request({ items: [{ compositeId: "10-bamboo", quantity: 25 }] }),
    deps({ rateLimit })
  );
  assert.equal(state.acquired, 0);
});

test("replays take a rate limit slot before the lookup and keep it when they succeed", async () => {
  const { state, rateLimit } = limiter();
  lookupResponse = () => {
    assert.equal(state.acquired, 1);
    return {
      data: { orders: { data: [storedOrder().data.createOrder.data] } }
    };
  };
  const result = await placeOrder(request(), deps({ rateLimit }));
  assert.equal(result.status, 200);
  assert.deepEqual(state, { acquired: 1, released: 0 });
});

test("orders that are still reserving give their slot back and conflicts keep it", async () => {
  const { state, rateLimit } = limiter();
  lookupResponse = {
    data: { orders: { data: [storedOrder().data.createOrder.data] } }
  };
  await placeOrder(
    request({ items: [{ compositeId: "20-coal", quantity: 1 }] }),
    deps({ rateLimit })
  );
  lookupResponse = {
    data: {
      orders: {
        data: [storedOrder({ stockReserved: false }).data.createOrder.data]
      }
    }
  };
  await placeOrder(request(), deps({ rateLimit }));
  assert.deepEqual(state, { acquired: 2, released: 1 });
});

test("a replay of a cancelled order is rejected without notifying or creating", async () => {
  lookupResponse = {
    data: {
      orders: {
        data: [storedOrder({ status: "Скасовано" }).data.createOrder.data]
      }
    }
  };
  const result = await placeOrder(request(), deps());
  assert.equal(result.status, 409);
  assert.equal(result.body.error, "ORDER_CANCELLED");
  assert.deepEqual(messages, []);
  assert.ok(!calls.some((call) => call.text.includes("createOrder")));
});

test("a blocked address cannot replay an order either", async () => {
  const { rateLimit } = limiter(false);
  lookupResponse = {
    data: { orders: { data: [storedOrder().data.createOrder.data] } }
  };
  const result = await placeOrder(request(), deps({ rateLimit }));
  assert.equal(result.status, 429);
  assert.deepEqual(calls, []);
  assert.deepEqual(messages, []);
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

test("a duplicate-key race resolved to the winning order counts like a replay", async () => {
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
  assert.deepEqual(state, { acquired: 1, released: 0 });
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

const existingOrder = (overrides = {}) =>
  storedOrder(overrides).data.createOrder.data;
const lookupReturns = (order) => {
  lookupResponse = { data: { orders: { data: [order] } } };
};

test("a replay of an order that was never notified sends it once and marks it", async () => {
  lookupReturns(existingOrder());
  const result = await placeOrder(request(), deps());
  assert.deepEqual(result, { status: 200, body: { ok: true, notified: true } });
  assert.equal(messages.length, 1);
  assert.deepEqual(marked, ["7"]);
});

test("a replay of an order that was already notified sends nothing", async () => {
  lookupReturns(existingOrder({ notifiedAt: "2026-01-02T03:04:05.000Z" }));
  const result = await placeOrder(request(), deps());
  assert.deepEqual(result, { status: 200, body: { ok: true, notified: true } });
  assert.deepEqual(messages, []);
  assert.deepEqual(marked, []);
});

test("a conflict on an order that was already notified sends nothing", async () => {
  lookupReturns(existingOrder({ notifiedAt: "2026-01-02T03:04:05.000Z" }));
  const result = await placeOrder(
    request({ items: [{ compositeId: "10-bamboo", quantity: 3 }] }),
    deps()
  );
  assert.equal(result.status, 409);
  assert.equal(result.body.orderId, "7");
  assert.deepEqual(messages, []);
  assert.deepEqual(marked, []);
});

test("a failed notification stays unmarked and the next replay retries it", async (t) => {
  t.mock.method(console, "error", () => {});
  lookupReturns(existingOrder());
  let telegramUp = false;
  const flaky = deps({
    notify: async (parts) => {
      if (!telegramUp) throw new Error("telegram down");
      messages.push(...parts);
    }
  });
  const first = await placeOrder(request(), flaky);
  assert.deepEqual(first.body, { ok: true, notified: false });
  assert.deepEqual(marked, []);
  assert.match(
    console.error.mock.calls[0].arguments[0],
    /Order 7 not notified/
  );
  telegramUp = true;
  const second = await placeOrder(request(), flaky);
  assert.deepEqual(second.body, { ok: true, notified: true });
  assert.equal(messages.length, 1);
  assert.deepEqual(marked, ["7"]);
});

test("a failed mark does not fail the order and is logged with the order id", async (t) => {
  t.mock.method(console, "error", () => {});
  const result = await placeOrder(
    request(),
    deps({
      markNotified: async () => {
        throw new Error("strapi down");
      }
    })
  );
  assert.deepEqual(result, { status: 200, body: { ok: true, notified: true } });
  assert.match(console.error.mock.calls[0].arguments[0], /Order 7 /);
  assert.match(console.error.mock.calls[0].arguments[0], /notifiedAt/);
});

test("the owner message is built only from the stored order", async () => {
  lookupReturns(
    existingOrder({
      name: "Stored",
      lastName: "Person",
      address: "Odesa",
      phoneNumber: "+380 50 000 00 00",
      department: "Branch 9"
    })
  );
  await placeOrder(request(), deps());
  assert.match(messages[0], /Person Stored/);
  assert.match(messages[0], /\*Місто:\* Odesa/);
  assert.match(messages[0], /\*Відділення:\* Branch 9/);
  assert.doesNotMatch(messages[0], /Petrenko|Ivan|Kyiv/);
});

test("a new order is announced with its stored name and last name", async () => {
  createResponse = storedOrder({ name: "Stored", lastName: "Person" });
  await placeOrder(request(), deps());
  assert.match(messages[0], /Person Stored/);
});

test("changed contact details or promocode make the same key a conflict", async () => {
  lookupReturns(existingOrder());
  const changes = [
    { name: "Petro" },
    { lastName: "Ivanenko" },
    { phone: "+380 50 111 22 33" },
    { city: "Lviv" },
    { warehouses: "Branch 2" },
    { promocode: "SALE" }
  ];
  for (const change of changes) {
    const result = await placeOrder(request(change), deps());
    assert.equal(result.status, 409, JSON.stringify(change));
    assert.equal(result.body.error, "IDEMPOTENCY_CONFLICT");
    assert.equal(created().length, 0);
  }
});

test("whitespace differences in contact details do not change the request hash", async () => {
  lookupReturns(existingOrder());
  const result = await placeOrder(
    request({ city: "  Kyiv ", name: "Ivan  " }),
    deps()
  );
  assert.equal(result.status, 200);
});

test("a create that times out is recovered by a short lookup when it committed", async () => {
  let lookups = 0;
  const lookupOptions = [];
  lookupResponse = () => {
    lookups += 1;
    return lookups === 1
      ? noOrderFound
      : { data: { orders: { data: [existingOrder()] } } };
  };
  const base = deps();
  const result = await placeOrder(request(), {
    ...base,
    graphql: async (query, variables, options) => {
      const text = print(query);
      if (text.includes("GetOrderByKey")) lookupOptions.push(options);
      if (text.includes("CreateOrder")) {
        calls.push({ text, variables });
        throw new DOMException("timed out", "TimeoutError");
      }
      return base.graphql(query, variables, options);
    }
  });
  assert.deepEqual(result, { status: 200, body: { ok: true, notified: true } });
  assert.deepEqual(lookupOptions, [undefined, { recovery: true }]);
  assert.equal(messages.length, 1);
  assert.deepEqual(marked, ["7"]);
});

test("a timed out create that did not commit answers an upstream error", async (t) => {
  t.mock.method(console, "error", () => {});
  const base = deps();
  const result = await placeOrder(request(), {
    ...base,
    graphql: async (query, variables, options) => {
      if (print(query).includes("CreateOrder")) throw new Error("timed out");
      return base.graphql(query, variables, options);
    }
  });
  assert.deepEqual(result, { status: 502, body: { error: "UPSTREAM_ERROR" } });
  assert.deepEqual(messages, []);
});

test("a timed out create whose order is still reserving asks to retry shortly", async () => {
  let lookups = 0;
  lookupResponse = () => {
    lookups += 1;
    return lookups === 1
      ? noOrderFound
      : {
          data: { orders: { data: [existingOrder({ stockReserved: false })] } }
        };
  };
  const base = deps();
  const result = await placeOrder(request(), {
    ...base,
    graphql: async (query, variables, options) => {
      if (print(query).includes("CreateOrder")) throw new Error("aborted");
      return base.graphql(query, variables, options);
    }
  });
  assert.deepEqual(result, {
    status: 409,
    body: { error: "ORDER_IN_PROGRESS" }
  });
  assert.deepEqual(messages, []);
});

const manyItems = (count, nameLength) =>
  Array.from({ length: count }, (_, index) => ({
    name: `ITEM${String(index).padStart(2, "0")}${"Ж".repeat(nameLength)}-(x)`,
    price: 100 + index,
    discount: index % 3,
    quantity: 1 + (index % 4)
  }));

const orderInput = (items) => ({
  orderId: "123",
  firstName: "Ivan",
  lastName: "Petrenko",
  city: "Kyiv",
  phone: "+380 67 123 45 67",
  warehouse: "Branch 1",
  items,
  promocode: "SALE-1",
  promocodeDiscount: 5
});

test("a short order stays a single message", () => {
  assert.equal(buildOrderMessages(orderInput(manyItems(2, 10))).length, 1);
});

test("a long order is split into parts that fit Telegram and keep every item once", () => {
  let sawSummaryAlone = false;
  let sawSplit = false;
  for (let count = 1; count <= 20; count += 1) {
    for (let nameLength = 10; nameLength <= 255; nameLength += 15) {
      const items = manyItems(count, nameLength);
      const parts = buildOrderMessages(orderInput(items));
      assert.ok(parts.length >= 1);
      if (parts.length > 1) sawSplit = true;
      parts.forEach((part, index) => {
        assert.ok(part.length <= 4096, `${count}x${nameLength} part ${index}`);
        const [text, entities] = MarkdownV2Parser.parse(part);
        assert.ok(text.length <= 4096);
        assert.ok(
          entities
            .filter(({ length }) => length > 0)
            .every(({ className }) => className === "MessageEntityBold")
        );
        assert.match(text, /№ 123/);
        if (parts.length > 1) {
          assert.ok(text.includes(`(${index + 1}/${parts.length})`));
        }
      });
      const joined = parts.join("\n");
      items.forEach((_, index) => {
        const token = `ITEM${String(index).padStart(2, "0")}`;
        assert.equal(joined.split(token).length, 2, token);
      });
      const withSummary = parts.filter((part) =>
        part.includes("Загальна сума:")
      );
      assert.equal(withSummary.length, 1);
      assert.equal(withSummary[0], parts[parts.length - 1]);
      assert.equal(
        parts.filter((part) => part.includes("Нове замовлення")).length,
        1
      );
      assert.ok(parts[0].includes("Нове замовлення"));
      if (parts.length > 1 && !parts[parts.length - 1].includes("*Назва:*")) {
        sawSummaryAlone = true;
      }
    }
  }
  assert.ok(sawSplit);
  assert.ok(sawSummaryAlone);
});

test("hostile text survives splitting without breaking the formatting", () => {
  const hostile = "*bold* [Pay](https://evil.example) _x_ `y` ~z~ |w|";
  const items = Array.from({ length: 12 }, () => ({
    name: `${hostile}${"Я".repeat(250)}`,
    price: 10,
    discount: 0,
    quantity: 1
  }));
  const parts = buildOrderMessages(orderInput(items));
  assert.ok(parts.length > 1);
  for (const part of parts) {
    const [text, entities] = MarkdownV2Parser.parse(part);
    assert.ok(
      entities
        .filter(({ length }) => length > 0)
        .every(({ className }) => className === "MessageEntityBold")
    );
    if (text.includes("*Назва:*")) assert.ok(text.includes(hostile));
  }
});
