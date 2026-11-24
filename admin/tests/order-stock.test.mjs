import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { afterEach, beforeEach, test } from "node:test";

const require = createRequire(import.meta.url);
const knex = require("knex");
const lifecycles = require("../src/api/order/content-types/order/lifecycles.js");
const { getRestockItems } = require("../src/api/order/utils/order-stock.js");

let db;

const createStrapi = () => ({
  db: {
    connection: db,
    metadata: {
      get: () => ({
        tableName: "products",
        attributes: {
          odId: { columnName: "od_id" },
          numberOf: { columnName: "number_of" },
        },
      }),
    },
    query: (uid) => ({
      async findMany({ where }) {
        const rows = await db("products")
          .whereIn("od_id", where.odId.$in)
          .join("categories", "categories.id", "products.category_id")
          .select(
            "products.id",
            "products.name",
            "products.price",
            "products.discount",
            "products.od_id as odId",
            "products.locale",
            "categories.name as categoryName"
          );
        return rows.map(({ categoryName, ...row }) => ({
          ...row,
          category: { name: categoryName },
        }));
      },
      async findOne({ where }) {
        if (uid === "api::order.order") {
          return db("orders").where(where).first();
        }
        const row = await db("promocodes").where({ name: where.name }).first();
        if (!row || row.published_at === null) return null;
        return {
          name: row.name,
          discount: row.discount,
          dateStart: row.date_start,
          dateEnd: row.date_end,
          minAmount: row.min_amount,
          numberOfUses: row.number_of_uses,
          categories: JSON.parse(row.categories).map((name) => ({ name })),
        };
      },
    }),
  },
});

const stock = async (odId) =>
  (await db("products").where("od_id", odId).orderBy("id")).map(
    (row) => row.number_of
  );

const createOrder = (order, extra = {}) => {
  const data = { name: "Client", order, ...extra };
  return lifecycles.beforeCreate({ params: { data } }).then(() => data);
};

const assertRejected = async (promise, code) => {
  await assert.rejects(promise, (error) => {
    assert.equal(error.details.code, code);
    return true;
  });
  return promise.catch((error) => error);
};

beforeEach(async () => {
  db = knex({
    client: "better-sqlite3",
    connection: { filename: ":memory:" },
    useNullAsDefault: true,
  });
  await db.schema.createTable("categories", (t) => {
    t.integer("id");
    t.string("name");
  });
  await db.schema.createTable("products", (t) => {
    t.integer("id");
    t.string("name");
    t.decimal("price");
    t.integer("discount");
    t.integer("number_of");
    t.integer("od_id");
    t.string("locale");
    t.integer("category_id");
  });
  await db.schema.createTable("promocodes", (t) => {
    t.string("name");
    t.integer("discount");
    t.string("date_start");
    t.string("date_end");
    t.integer("min_amount");
    t.integer("number_of_uses");
    t.string("categories");
    t.string("published_at");
  });
  await db.schema.createTable("orders", (t) => {
    t.integer("id");
    t.string("status");
  });
  await db("categories").insert([
    { id: 1, name: "tobacco" },
    { id: 2, name: "coal" },
  ]);
  await db("products").insert([
    {
      id: 1,
      name: "Bamboo",
      price: 300,
      discount: 10,
      number_of: 5,
      od_id: 10,
      locale: "uk",
      category_id: 1,
    },
    {
      id: 2,
      name: "Бамбук",
      price: 300,
      discount: 10,
      number_of: 5,
      od_id: 10,
      locale: "ru",
      category_id: 1,
    },
    {
      id: 3,
      name: "Coal",
      price: 100,
      discount: 0,
      number_of: 2,
      od_id: 20,
      locale: "uk",
      category_id: 2,
    },
    {
      id: 4,
      name: "Уголь",
      price: 100,
      discount: 0,
      number_of: 2,
      od_id: 20,
      locale: "ru",
      category_id: 2,
    },
    {
      id: 5,
      name: "Gone",
      price: 50,
      discount: 0,
      number_of: -3,
      od_id: 30,
      locale: "uk",
      category_id: 1,
    },
  ]);
  globalThis.strapi = createStrapi();
});

afterEach(() => db.destroy());

test("sufficient stock decrements every locale row and stores database values", async () => {
  const data = await createOrder([
    {
      odId: 10,
      quantity: 2,
      name: "hacked",
      price: 1,
      discount: 99,
      numberOf: 1000,
    },
    { odId: 20, quantity: 1 },
  ]);
  assert.deepEqual(await stock(10), [3, 3]);
  assert.deepEqual(await stock(20), [1, 1]);
  assert.deepEqual(data.order, [
    {
      id: 1,
      odId: 10,
      name: "Bamboo",
      price: 300,
      discount: 10,
      quantity: 2,
      numberOf: 3,
    },
    {
      id: 3,
      odId: 20,
      name: "Coal",
      price: 100,
      discount: 0,
      quantity: 1,
      numberOf: 1,
    },
  ]);
  assert.equal(data.promocode, null);
  assert.equal(data.promocodeDiscount, 0);
});

test("ordering exactly the remaining stock leaves zero", async () => {
  await createOrder([{ odId: 20, quantity: 2 }]);
  assert.deepEqual(await stock(20), [0, 0]);
});

test("insufficient stock rejects and changes nothing", async () => {
  const error = await assertRejected(
    createOrder([{ odId: 20, quantity: 3 }]),
    "OUT_OF_STOCK"
  );
  assert.deepEqual(error.details.items, [
    { odId: 20, name: "Coal", requested: 3, available: 2 },
  ]);
  assert.deepEqual(await stock(20), [2, 2]);
});

test("a short item rolls back the rest of a multi-item order", async () => {
  const error = await assertRejected(
    createOrder([
      { odId: 10, quantity: 1 },
      { odId: 20, quantity: 5 },
    ]),
    "OUT_OF_STOCK"
  );
  assert.deepEqual(
    error.details.items.map((item) => item.odId),
    [20]
  );
  assert.deepEqual(await stock(10), [5, 5]);
  assert.deepEqual(await stock(20), [2, 2]);
});

test("every unavailable product is reported together", async () => {
  const error = await assertRejected(
    createOrder([
      { odId: 10, quantity: 9 },
      { odId: 20, quantity: 5 },
    ]),
    "OUT_OF_STOCK"
  );
  assert.deepEqual(
    error.details.items.map((item) => item.odId),
    [10, 20]
  );
});

test("already negative or unknown products cannot be ordered and stay untouched", async () => {
  await assertRejected(
    createOrder([{ odId: 30, quantity: 1 }]),
    "OUT_OF_STOCK"
  );
  await assertRejected(
    createOrder([{ odId: 999, quantity: 1 }]),
    "OUT_OF_STOCK"
  );
  assert.deepEqual(await stock(30), [-3]);
});

test("concurrent orders never oversell", async () => {
  const results = await Promise.allSettled(
    Array.from({ length: 4 }, () => createOrder([{ odId: 10, quantity: 2 }]))
  );
  assert.equal(results.filter((r) => r.status === "fulfilled").length, 2);
  assert.deepEqual(await stock(10), [1, 1]);
});

test("duplicate lines for one product are summed before the stock check", async () => {
  await assertRejected(
    createOrder([
      { odId: 20, quantity: 1 },
      { odId: "20", quantity: 2 },
    ]),
    "OUT_OF_STOCK"
  );
  assert.deepEqual(await stock(20), [2, 2]);
});

test("malformed items are rejected without touching stock", async () => {
  const invalid = [
    undefined,
    [],
    "x",
    [{ odId: 10, quantity: 0 }],
    [{ odId: 10, quantity: -1 }],
    [{ odId: 10, quantity: 1.5 }],
    [{ odId: 10, quantity: "1" }],
    [{ quantity: 1 }],
    [{ odId: "abc", quantity: 1 }],
  ];
  for (const order of invalid) {
    await assertRejected(createOrder(order), "INVALID_ORDER");
  }
  assert.deepEqual(await stock(10), [5, 5]);
});

const insertPromocode = (overrides = {}) =>
  db("promocodes").insert({
    name: "SALE",
    discount: 20,
    date_start: "2020-01-01T00:00:00.000Z",
    date_end: "2999-01-01T00:00:00.000Z",
    min_amount: 100,
    number_of_uses: 5,
    categories: JSON.stringify(["tobacco"]),
    published_at: "2024-01-01",
    ...overrides,
  });

test("a valid promocode discounts only its categories", async () => {
  await insertPromocode();
  const data = await createOrder(
    [
      { odId: 10, quantity: 1 },
      { odId: 20, quantity: 1 },
    ],
    { promocode: "SALE" }
  );
  assert.deepEqual(
    data.order.map((item) => item.discount),
    [20, 0]
  );
  assert.equal(data.promocode, "SALE");
  assert.equal(data.promocodeDiscount, 20);
});

test("invalid promocodes reject the order and leave stock alone", async () => {
  await insertPromocode({ name: "OLD", date_end: "2020-02-01T00:00:00.000Z" });
  await insertPromocode({ name: "USED", number_of_uses: 0 });
  await insertPromocode({ name: "BIG", min_amount: 100000 });
  await insertPromocode({ name: "DRAFT", published_at: null });
  for (const promocode of ["OLD", "USED", "BIG", "DRAFT", "MISSING", 5]) {
    await assertRejected(
      createOrder([{ odId: 10, quantity: 1 }], { promocode }),
      "PROMOCODE_INVALID"
    );
  }
  assert.deepEqual(await stock(10), [5, 5]);
});

const update = async (status, order) => {
  const previous = await db("orders").where({ id: 1 }).first();
  const event = { params: { where: { id: 1 } }, state: {} };
  await lifecycles.beforeUpdate(event);
  await db("orders").where({ id: 1 }).update({ status });
  await lifecycles.afterUpdate({
    ...event,
    result: { id: 1, status, order },
  });
  return previous;
};

test("cancelling an order restocks once even if saved again", async () => {
  await db("orders").insert({ id: 1, status: "В обробці" });
  const order = [{ odId: 10, quantity: 2 }];
  await createOrder(order);
  assert.deepEqual(await stock(10), [3, 3]);
  await update("Скасовано", order);
  assert.deepEqual(await stock(10), [5, 5]);
  await update("Скасовано", order);
  assert.deepEqual(await stock(10), [5, 5]);
});

test("other status changes do not restock", async () => {
  await db("orders").insert({ id: 1, status: "В обробці" });
  await update("Виконано", [{ odId: 10, quantity: 2 }]);
  assert.deepEqual(await stock(10), [5, 5]);
});

test("restock items ignore malformed stored lines", () => {
  assert.deepEqual(
    getRestockItems([
      { odId: 2, quantity: 1 },
      { odId: null, quantity: 1 },
      { odId: 2, quantity: 2 },
      { odId: 3, quantity: 0 },
      null,
    ]),
    [{ odId: 2, quantity: 3 }]
  );
  assert.deepEqual(getRestockItems(undefined), []);
});
