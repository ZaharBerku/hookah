import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { afterEach, beforeEach, describe, test } from "node:test";

const require = createRequire(import.meta.url);
const knex = require("knex");
const lifecycles = require("../src/api/order/content-types/order/lifecycles.js");
const { getStockItems } = require("../src/api/order/utils/order-stock.js");

const BAMBOO = "10-bamboo";
const COAL = "20-coal";
const GONE = "30-gone";
const LEGACY_A = "legacy-a";
const LEGACY_B = "legacy-b";
const CANCELLED = "Скасовано";
const PROCESSING = "В обробці";

const dialects = [
  {
    name: "sqlite",
    schema: undefined,
    connect: () =>
      knex({
        client: "better-sqlite3",
        connection: { filename: ":memory:" },
        useNullAsDefault: true,
      }),
  },
];
if (process.env.ORDER_STOCK_PG_URL) {
  dialects.push({
    name: "postgres",
    schema: "public",
    connect: () =>
      knex({
        client: "pg",
        connection: process.env.ORDER_STOCK_PG_URL,
        pool: { min: 0, max: 10 },
      }),
  });
}

const productColumns = {
  compositeId: "composite_id",
  odId: "od_id",
  numberOf: "number_of",
};

for (const dialect of dialects) {
  describe(dialect.name, () => {
    let db;
    let logged;
    let nextOrderId;
    let failDeletes;

    const createStrapi = (connection = db) => ({
      log: { error: (...args) => logged.push(args) },
      db: {
        connection,
        getSchemaName: () => dialect.schema,
        metadata: {
          get: (uid) =>
            uid === "api::order.order"
              ? {
                  tableName: "orders",
                  attributes: {
                    status: { columnName: "status" },
                    order: { columnName: "order" },
                  },
                }
              : {
                  tableName: "products",
                  attributes: Object.fromEntries(
                    Object.entries(productColumns).map(([key, columnName]) => [
                      key,
                      { columnName },
                    ])
                  ),
                },
        },
        query: (uid) => ({
          async findMany({ where }) {
            const query = db("products").join(
              "categories",
              "categories.id",
              "products.category_id"
            );
            query.where((builder) => {
              for (const condition of where.$or) {
                if (condition.compositeId) {
                  builder.orWhereIn(
                    "products.composite_id",
                    condition.compositeId.$in
                  );
                }
                if (condition.odId) {
                  builder.orWhereIn("products.od_id", condition.odId.$in);
                }
              }
            });
            const rows = await query.select(
              "products.id",
              "products.name",
              "products.price",
              "products.discount",
              "products.composite_id as compositeId",
              "products.od_id as odId",
              "products.locale",
              "categories.name as categoryName"
            );
            return rows.map(({ categoryName, price, ...row }) => ({
              ...row,
              price: Number(price),
              category: { name: categoryName },
            }));
          },
          async findOne({ where }) {
            if (uid === "api::order.order") {
              return db("orders").where(where).first();
            }
            const row = await db("promocodes")
              .where({ name: where.name })
              .first();
            if (!row || row.published_at === null) return null;
            return {
              name: row.name,
              discount: row.discount,
              dateStart: row.date_start,
              dateEnd: row.date_end,
              minAmount: row.min_amount,
              numberOfUses: row.number_of_uses,
              categories: JSON.parse(row.categories).map((name) => ({
                name,
              })),
            };
          },
          async delete({ where }) {
            if (failDeletes) throw new Error("delete failed");
            await db("orders").where(where).del();
          },
        }),
      },
    });

    const stock = async (compositeId) =>
      (await db("products").where("composite_id", compositeId).orderBy("id"))
        .map((row) => Number(row.number_of));

    const orderRows = () => db("orders").orderBy("id");

    const createOrder = async (items, extra = {}) => {
      const data = { name: "Client", order: items, ...extra };
      await lifecycles.beforeCreate({ params: { data } });
      const id = nextOrderId++;
      await db("orders").insert({
        id,
        name: data.name,
        status: data.status ?? PROCESSING,
        order: JSON.stringify(data.order),
        idempotency_key: data.idempotencyKey ?? null,
      });
      const result = { id, status: data.status ?? PROCESSING, order: data.order };
      await lifecycles.afterCreate({ params: { data }, result });
      return { id, data };
    };

    const updateOrder = async (id, data) => {
      await lifecycles.beforeUpdate({ params: { where: { id }, data } });
      await db("orders").where({ id }).update(data);
    };

    const statusOf = async (id) => (await db("orders").where({ id }).first()).status;

    const assertRejected = async (promise, code) => {
      const error = await promise.then(
        () => assert.fail("expected a rejection"),
        (reason) => reason
      );
      assert.equal(error.details.code, code);
      return error;
    };

    beforeEach(async () => {
      db = dialect.connect();
      logged = [];
      nextOrderId = 1;
      failDeletes = false;
      for (const table of ["orders", "promocodes", "products", "categories"]) {
        await db.schema.dropTableIfExists(table);
      }
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
        t.string("composite_id");
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
        t.integer("id").primary();
        t.string("name");
        t.string("status");
        t.json("order");
        t.string("idempotency_key").unique();
      });
      await db("categories").insert([
        { id: 1, name: "tobacco" },
        { id: 2, name: "coal" },
      ]);
      const product = (id, name, locale, rest) => ({
        id,
        name,
        locale,
        price: 100,
        discount: 0,
        number_of: 2,
        category_id: 2,
        ...rest,
      });
      await db("products").insert([
        product(1, "Bamboo", "uk", {
          price: 300,
          discount: 10,
          number_of: 5,
          composite_id: BAMBOO,
          od_id: 10,
          category_id: 1,
        }),
        product(2, "Бамбук", "ru", {
          price: 300,
          discount: 10,
          number_of: 5,
          composite_id: BAMBOO,
          od_id: 10,
          category_id: 1,
        }),
        product(3, "Coal", "uk", { composite_id: COAL, od_id: 20 }),
        product(4, "Уголь", "ru", { composite_id: COAL, od_id: 20 }),
        product(5, "Gone", "uk", {
          price: 50,
          number_of: -3,
          composite_id: GONE,
          od_id: 30,
          category_id: 1,
        }),
        product(6, "Legacy A", "uk", {
          number_of: 4,
          composite_id: LEGACY_A,
          od_id: null,
        }),
        product(7, "Legacy A ru", "ru", {
          number_of: 4,
          composite_id: LEGACY_A,
          od_id: null,
        }),
        product(8, "Legacy B", "uk", {
          number_of: 4,
          composite_id: LEGACY_B,
          od_id: null,
        }),
      ]);
      globalThis.strapi = createStrapi();
    });

    afterEach(() => db.destroy());

    test("sufficient stock decrements every locale row and stores database values", async () => {
      const { data } = await createOrder([
        {
          compositeId: BAMBOO,
          quantity: 2,
          name: "hacked",
          price: 1,
          discount: 99,
          numberOf: 1000,
        },
        { compositeId: COAL, quantity: 1 },
      ]);
      assert.deepEqual(await stock(BAMBOO), [3, 3]);
      assert.deepEqual(await stock(COAL), [1, 1]);
      assert.deepEqual(data.order, [
        {
          id: 1,
          compositeId: BAMBOO,
          odId: 10,
          name: "Bamboo",
          price: 300,
          discount: 10,
          quantity: 2,
        },
        {
          id: 3,
          compositeId: COAL,
          odId: 20,
          name: "Coal",
          price: 100,
          discount: 0,
          quantity: 1,
        },
      ]);
      assert.equal(data.promocode, null);
      assert.equal(data.promocodeDiscount, 0);
    });

    test("ordering exactly the remaining stock leaves zero", async () => {
      await createOrder([{ compositeId: COAL, quantity: 2 }]);
      assert.deepEqual(await stock(COAL), [0, 0]);
    });

    test("insufficient stock rejects, removes the inserted order and changes nothing", async () => {
      const error = await assertRejected(
        createOrder([{ compositeId: COAL, quantity: 3 }]),
        "OUT_OF_STOCK"
      );
      assert.deepEqual(error.details.items, [
        {
          compositeId: COAL,
          odId: null,
          name: "Coal",
          requested: 3,
          available: 2,
        },
      ]);
      assert.deepEqual(await stock(COAL), [2, 2]);
      assert.deepEqual(await orderRows(), []);
    });

    test("a short item rolls back the rest of a multi-item order", async () => {
      const error = await assertRejected(
        createOrder([
          { compositeId: BAMBOO, quantity: 1 },
          { compositeId: COAL, quantity: 5 },
        ]),
        "OUT_OF_STOCK"
      );
      assert.deepEqual(
        error.details.items.map((item) => item.compositeId),
        [COAL]
      );
      assert.deepEqual(await stock(BAMBOO), [5, 5]);
      assert.deepEqual(await stock(COAL), [2, 2]);
      assert.deepEqual(await orderRows(), []);
    });

    test("every unavailable product is reported together", async () => {
      const error = await assertRejected(
        createOrder([
          { compositeId: BAMBOO, quantity: 9 },
          { compositeId: COAL, quantity: 5 },
        ]),
        "OUT_OF_STOCK"
      );
      assert.deepEqual(
        error.details.items.map((item) => item.compositeId),
        [BAMBOO, COAL]
      );
    });

    test("negative or unknown products cannot be ordered and stay untouched", async () => {
      await assertRejected(
        createOrder([{ compositeId: GONE, quantity: 1 }]),
        "OUT_OF_STOCK"
      );
      await assertRejected(
        createOrder([{ compositeId: "unknown", quantity: 1 }]),
        "OUT_OF_STOCK"
      );
      assert.deepEqual(await stock(GONE), [-3]);
    });

    test("concurrent orders never oversell and leave no orphan orders", async () => {
      const results = await Promise.allSettled(
        Array.from({ length: 4 }, () =>
          createOrder([{ compositeId: BAMBOO, quantity: 2 }])
        )
      );
      assert.equal(results.filter((r) => r.status === "fulfilled").length, 2);
      assert.deepEqual(await stock(BAMBOO), [1, 1]);
      assert.equal((await orderRows()).length, 2);
    });

    test("concurrent multi-item orders in opposite order do not deadlock", async () => {
      const results = await Promise.allSettled(
        Array.from({ length: 10 }, (_, index) =>
          createOrder(
            index % 2
              ? [
                  { compositeId: BAMBOO, quantity: 1 },
                  { compositeId: COAL, quantity: 1 },
                ]
              : [
                  { compositeId: COAL, quantity: 1 },
                  { compositeId: BAMBOO, quantity: 1 },
                ]
          )
        )
      );
      assert.equal(results.filter((r) => r.status === "fulfilled").length, 2);
      assert.deepEqual(await stock(COAL), [0, 0]);
      assert.deepEqual(await stock(BAMBOO), [3, 3]);
    });

    test("duplicate lines for one product are summed before the stock check", async () => {
      await assertRejected(
        createOrder([
          { compositeId: COAL, quantity: 1 },
          { compositeId: COAL, quantity: 2 },
        ]),
        "OUT_OF_STOCK"
      );
      assert.deepEqual(await stock(COAL), [2, 2]);
    });

    test("an odId reference resolves to the same product as its compositeId", async () => {
      const { data } = await createOrder([
        { odId: "10", quantity: 1 },
        { compositeId: BAMBOO, quantity: 1 },
      ]);
      assert.equal(data.order.length, 1);
      assert.equal(data.order[0].quantity, 2);
      assert.deepEqual(await stock(BAMBOO), [3, 3]);
    });

    test("malformed items and oversized orders are rejected without touching stock", async () => {
      const invalid = [
        undefined,
        [],
        "x",
        [{ compositeId: BAMBOO, quantity: 0 }],
        [{ compositeId: BAMBOO, quantity: -1 }],
        [{ compositeId: BAMBOO, quantity: 1.5 }],
        [{ compositeId: BAMBOO, quantity: "1" }],
        [{ compositeId: BAMBOO, quantity: 21 }],
        [{ quantity: 1 }],
        [{ odId: "abc", quantity: 1 }],
        [{ compositeId: "", quantity: 1 }],
        [{ compositeId: 5, quantity: 1 }],
        Array.from({ length: 21 }, () => ({ compositeId: BAMBOO, quantity: 1 })),
      ];
      for (const order of invalid) {
        await assertRejected(createOrder(order), "INVALID_ORDER");
      }
      await assertRejected(
        createOrder([
          { compositeId: BAMBOO, quantity: 15 },
          { compositeId: BAMBOO, quantity: 15 },
        ]),
        "INVALID_ORDER"
      );
      assert.deepEqual(await stock(BAMBOO), [5, 5]);
      assert.deepEqual(await orderRows(), []);
    });

    test("twenty lines of twenty units are accepted as the upper bound", async () => {
      await db("products").update({ number_of: 100 });
      const ids = [BAMBOO, COAL, LEGACY_A, LEGACY_B];
      await createOrder(ids.map((compositeId) => ({ compositeId, quantity: 20 })));
      assert.deepEqual(await stock(BAMBOO), [80, 80]);
    });

    test("products without an odId can be ordered, reserved and restocked by compositeId", async () => {
      const { id, data } = await createOrder([
        { compositeId: LEGACY_A, quantity: 3 },
      ]);
      assert.equal(data.order[0].odId, null);
      assert.deepEqual(await stock(LEGACY_A), [1, 1]);
      assert.deepEqual(await stock(LEGACY_B), [4]);
      await updateOrder(id, { status: CANCELLED });
      assert.deepEqual(await stock(LEGACY_A), [4, 4]);
      assert.deepEqual(await stock(LEGACY_B), [4]);
    });

    test("a short product without an odId is rejected without touching others", async () => {
      await assertRejected(
        createOrder([{ compositeId: LEGACY_A, quantity: 5 }]),
        "OUT_OF_STOCK"
      );
      assert.deepEqual(await stock(LEGACY_A), [4, 4]);
      assert.deepEqual(await stock(LEGACY_B), [4]);
    });

    test("invalid contact fields are rejected before anything is reserved", async () => {
      const items = [{ compositeId: BAMBOO, quantity: 1 }];
      for (const extra of [
        { name: "x".repeat(256) },
        { name: 5 },
        { phoneNumber: "1".repeat(256) },
        { address: "a".repeat(1001) },
        { department: {} },
        { idempotencyKey: "k".repeat(256) },
      ]) {
        await assertRejected(createOrder(items, extra), "INVALID_ORDER");
      }
      assert.deepEqual(await stock(BAMBOO), [5, 5]);
      assert.deepEqual(await orderRows(), []);
    });

    test("a failed insert never reserves stock, including a repeated idempotency key", async () => {
      const items = [{ compositeId: BAMBOO, quantity: 1 }];
      await createOrder(items, { idempotencyKey: "same-key" });
      await assert.rejects(createOrder(items, { idempotencyKey: "same-key" }));
      assert.deepEqual(await stock(BAMBOO), [4, 4]);
      assert.equal((await orderRows()).length, 1);
    });

    test("an order created as cancelled does not reserve stock", async () => {
      const { id } = await createOrder([{ compositeId: COAL, quantity: 1 }], {
        status: CANCELLED,
      });
      assert.deepEqual(await stock(COAL), [2, 2]);
      await updateOrder(id, { status: PROCESSING });
      assert.deepEqual(await stock(COAL), [1, 1]);
    });

    test("a failed compensating delete is logged with the order id and the original error is kept", async () => {
      failDeletes = true;
      await assertRejected(
        createOrder([{ compositeId: COAL, quantity: 3 }]),
        "OUT_OF_STOCK"
      );
      assert.match(logged[0][0], /Order 1 was created without reserved stock/);
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
      const { data } = await createOrder(
        [
          { compositeId: BAMBOO, quantity: 1 },
          { compositeId: COAL, quantity: 1 },
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
      await insertPromocode({
        name: "OLD",
        date_end: "2020-02-01T00:00:00.000Z",
      });
      await insertPromocode({ name: "USED", number_of_uses: 0 });
      await insertPromocode({ name: "BIG", min_amount: 100000 });
      await insertPromocode({ name: "DRAFT", published_at: null });
      for (const promocode of ["OLD", "USED", "BIG", "DRAFT", "MISSING", 5]) {
        await assertRejected(
          createOrder([{ compositeId: BAMBOO, quantity: 1 }], { promocode }),
          "PROMOCODE_INVALID"
        );
      }
      assert.deepEqual(await stock(BAMBOO), [5, 5]);
    });

    test("cancelling restocks once even if saved again", async () => {
      const { id } = await createOrder([{ compositeId: BAMBOO, quantity: 2 }]);
      assert.deepEqual(await stock(BAMBOO), [3, 3]);
      await updateOrder(id, { status: CANCELLED });
      assert.deepEqual(await stock(BAMBOO), [5, 5]);
      await updateOrder(id, { status: CANCELLED });
      assert.deepEqual(await stock(BAMBOO), [5, 5]);
    });

    test("cancel, un-cancel and cancel again keeps stock symmetric", async () => {
      const { id } = await createOrder([{ compositeId: BAMBOO, quantity: 2 }]);
      await updateOrder(id, { status: CANCELLED });
      assert.deepEqual(await stock(BAMBOO), [5, 5]);
      await updateOrder(id, { status: PROCESSING });
      assert.deepEqual(await stock(BAMBOO), [3, 3]);
      await updateOrder(id, { status: CANCELLED });
      assert.deepEqual(await stock(BAMBOO), [5, 5]);
      await updateOrder(id, { status: "Виконано" });
      assert.deepEqual(await stock(BAMBOO), [3, 3]);
    });

    test("un-cancelling without enough stock is rejected and the order stays cancelled", async () => {
      const { id } = await createOrder([{ compositeId: COAL, quantity: 2 }]);
      await updateOrder(id, { status: CANCELLED });
      await createOrder([{ compositeId: COAL, quantity: 2 }]);
      const error = await assertRejected(
        updateOrder(id, { status: PROCESSING }),
        "OUT_OF_STOCK"
      );
      assert.match(error.message, /Cannot restore the order/);
      assert.match(error.message, /Coal/);
      assert.equal(await statusOf(id), CANCELLED);
      assert.deepEqual(await stock(COAL), [0, 0]);
    });

    test("concurrent cancel saves restock once", async () => {
      const { id } = await createOrder([{ compositeId: BAMBOO, quantity: 2 }]);
      await Promise.all([
        updateOrder(id, { status: CANCELLED }),
        updateOrder(id, { status: CANCELLED }),
        updateOrder(id, { status: CANCELLED }),
      ]);
      assert.deepEqual(await stock(BAMBOO), [5, 5]);
    });

    test("concurrent un-cancel saves reserve once", async () => {
      const { id } = await createOrder([{ compositeId: BAMBOO, quantity: 2 }]);
      await updateOrder(id, { status: CANCELLED });
      await Promise.all([
        updateOrder(id, { status: PROCESSING }),
        updateOrder(id, { status: PROCESSING }),
        updateOrder(id, { status: PROCESSING }),
      ]);
      assert.deepEqual(await stock(BAMBOO), [3, 3]);
    });

    test("other status changes and partial updates do not touch stock", async () => {
      const { id } = await createOrder([{ compositeId: BAMBOO, quantity: 2 }]);
      await updateOrder(id, { status: "Виконано" });
      await updateOrder(id, { name: "Renamed" });
      await updateOrder(id, { status: PROCESSING });
      assert.deepEqual(await stock(BAMBOO), [3, 3]);
    });

    test("a failed restock aborts the status change", async () => {
      const { id } = await createOrder([{ compositeId: BAMBOO, quantity: 2 }]);
      const broken = {
        ...db,
        transaction: () => Promise.reject(new Error("connection lost")),
      };
      globalThis.strapi = createStrapi(broken);
      await assert.rejects(
        updateOrder(id, { status: CANCELLED }),
        /connection lost/
      );
      assert.equal(await statusOf(id), PROCESSING);
      assert.deepEqual(await stock(BAMBOO), [3, 3]);
    });

    test("orders stored before compositeId existed are restocked by odId", async () => {
      await db("orders").insert({
        id: 50,
        status: PROCESSING,
        order: JSON.stringify([
          { id: 1, odId: 10, quantity: 2 },
          { id: 6, odId: null, quantity: 1 },
        ]),
      });
      await updateOrder(50, { status: CANCELLED });
      assert.deepEqual(await stock(BAMBOO), [7, 7]);
      assert.deepEqual(await stock(LEGACY_A), [4, 4]);
      assert.deepEqual(await stock(LEGACY_B), [4]);
    });

    test("stock items ignore malformed stored lines and merge duplicates", () => {
      assert.deepEqual(
        getStockItems([
          { compositeId: "b", odId: 2, quantity: 1, name: "B" },
          { compositeId: "b", quantity: 2 },
          { odId: 7, quantity: 1 },
          { odId: null, quantity: 1 },
          { compositeId: "c", quantity: 0 },
          null,
        ]),
        [
          { compositeId: "b", name: "B", quantity: 3 },
          { odId: 7, name: null, quantity: 1 },
        ]
      );
      assert.deepEqual(getStockItems(undefined), []);
      assert.deepEqual(getStockItems("not json"), []);
    });
  });
}
