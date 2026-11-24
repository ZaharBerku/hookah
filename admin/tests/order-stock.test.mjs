import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, afterEach, beforeEach, describe, test } from "node:test";

const require = createRequire(import.meta.url);
const { Database } = require("@strapi/database");
const lifecycles = require("../src/api/order/content-types/order/lifecycles.js");
const orderSchema = require("../src/api/order/content-types/order/schema.json");
const productSchema = require("../src/api/product/content-types/product/schema.json");
const markNotifiedRoutes = require("../src/api/order/routes/mark-notified.js");
const createOrderController = require("../src/api/order/controllers/order.js");
const {
  ORDER_UID,
  getStockItems,
  reserveStockForOrder,
} = require("../src/api/order/utils/order-stock.js");
const {
  markOrderNotified,
} = require("../src/api/order/utils/order-notification.js");

const BAMBOO = "10-bamboo";
const COAL = "20-coal";
const GONE = "30-gone";
const LEGACY_A = "legacy-a";
const LEGACY_B = "legacy-b";
const CANCELLED = "Скасовано";
const PROCESSING = "В обробці";
const DONE = "Виконано";

const sqliteDirectory = mkdtempSync(join(tmpdir(), "order-stock-"));
after(() => rmSync(sqliteDirectory, { recursive: true, force: true }));

const dialects = [
  {
    name: "sqlite",
    connection: {
      client: "sqlite",
      connection: { filename: join(sqliteDirectory, "orders.db") },
      useNullAsDefault: true,
    },
  },
];
if (process.env.ORDER_STOCK_PG_URL) {
  dialects.push({
    name: "postgres",
    connection: {
      client: "postgres",
      connection: { connectionString: process.env.ORDER_STOCK_PG_URL },
      pool: { min: 0, max: 10 },
    },
  });
}

const productColumns = {
  compositeId: "composite_id",
  odId: "od_id",
  numberOf: "number_of",
};

test("the order schema declares a column-level unique index for the idempotency key", () => {
  assert.equal(orderSchema.attributes.idempotencyKey.column.unique, true);
});

test("the order schema stores the last name and a notification timestamp", () => {
  assert.equal(orderSchema.attributes.lastName.type, "string");
  assert.equal(orderSchema.attributes.notifiedAt.type, "datetime");
});

test("product stock cannot be saved below zero from the admin", () => {
  assert.equal(productSchema.attributes.numberOf.min, 0);
});

test("the notification route is a POST on its own action", () => {
  assert.deepEqual(
    markNotifiedRoutes.routes.map(({ method, path, handler }) => ({
      method,
      path,
      handler,
    })),
    [
      {
        method: "POST",
        path: "/orders/:id/mark-notified",
        handler: "order.markNotified",
      },
    ]
  );
});

for (const dialect of dialects) {
  describe(dialect.name, () => {
    let orders;
    let db;
    let logged;
    let failDeletes;

    const productMetadata = {
      tableName: "products",
      attributes: Object.fromEntries(
        Object.entries(productColumns).map(([key, columnName]) => [
          key,
          { columnName },
        ])
      ),
    };

    const productRepository = (uid) => ({
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
    });

    const orderRepository = () => {
      const repository = orders.query(ORDER_UID);
      return {
        findOne: (params) => repository.findOne(params),
        updateMany: (params) => repository.updateMany(params),
        delete: async (params) => {
          if (failDeletes) throw new Error("delete failed");
          return repository.delete(params);
        },
      };
    };

    const createStrapi = (connection = db) => ({
      log: { error: (...args) => logged.push(args) },
      db: {
        connection,
        getSchemaName: () => orders.getSchemaName(),
        transaction: (callback) => orders.transaction(callback),
        metadata: {
          get: (uid) =>
            uid === ORDER_UID ? orders.metadata.get(uid) : productMetadata,
        },
        query: (uid) =>
          uid === ORDER_UID ? orderRepository() : productRepository(uid),
      },
    });

    const stock = async (compositeId) =>
      (
        await db("products").where("composite_id", compositeId).orderBy("id")
      ).map((row) => Number(row.number_of));

    const orderRows = () => db("orders").orderBy("id");

    const createOrder = async (items, extra = {}) => {
      const data = { name: "Client", order: items, ...extra };
      const result = await orders.query(ORDER_UID).create({ data });
      return { id: result.id, data };
    };

    const updateOrder = (id, data) =>
      orders.query(ORDER_UID).update({ where: { id }, data });

    const orderRow = (id) => db("orders").where({ id }).first();

    const statusOf = async (id) => (await orderRow(id)).status;

    const isReserved = async (id) =>
      Boolean((await orderRow(id)).stock_reserved);

    const assertRejected = async (promise, code) => {
      const error = await promise.then(
        () => assert.fail("expected a rejection"),
        (reason) => reason
      );
      assert.equal(error.details.code, code);
      return error;
    };

    beforeEach(async () => {
      logged = [];
      failDeletes = false;
      globalThis.strapi = { dirs: { app: { root: tmpdir() } } };
      orders = await Database.init({
        connection: dialect.connection,
        models: Database.transformContentTypes([
          {
            uid: ORDER_UID,
            modelName: "order",
            collectionName: orderSchema.collectionName,
            attributes: orderSchema.attributes,
            lifecycles,
          },
        ]),
      });
      db = orders.connection;
      for (const table of [
        "orders",
        "promocodes",
        "products",
        "categories",
        "strapi_database_schema",
      ]) {
        await db.schema.dropTableIfExists(table);
      }
      await orders.schema.syncSchema();
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

    afterEach(() => orders.destroy());

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
        Array.from({ length: 21 }, () => ({
          compositeId: BAMBOO,
          quantity: 1,
        })),
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
      await createOrder(
        ids.map((compositeId) => ({ compositeId, quantity: 20 }))
      );
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
      await assert.rejects(
        createOrder(items, { idempotencyKey: "same-key" }),
        /unique/i
      );
      assert.deepEqual(await stock(BAMBOO), [4, 4]);
      assert.equal((await orderRows()).length, 1);
    });

    test("concurrent creates with one idempotency key produce one order and reserve once", async () => {
      const items = [{ compositeId: BAMBOO, quantity: 1 }];
      const results = await Promise.allSettled(
        Array.from({ length: 6 }, () =>
          createOrder(items, { idempotencyKey: "same-key" })
        )
      );
      assert.equal(results.filter((r) => r.status === "fulfilled").length, 1);
      assert.deepEqual(await stock(BAMBOO), [4, 4]);
      assert.equal((await orderRows()).length, 1);
    });

    test("orders without an idempotency key can coexist", async () => {
      const items = [{ compositeId: BAMBOO, quantity: 1 }];
      await createOrder(items);
      await createOrder(items);
      await db("orders").insert({ status: PROCESSING });
      assert.equal((await orderRows()).length, 3);
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

    test("the status is written under the lock and removed from the outgoing data", async () => {
      const { id } = await createOrder([{ compositeId: BAMBOO, quantity: 2 }]);
      const data = { status: CANCELLED, name: "Renamed" };
      await lifecycles.beforeUpdate({ params: { where: { id }, data } });
      assert.equal("status" in data, false);
      assert.equal(data.name, "Renamed");
      assert.equal(await statusOf(id), CANCELLED);
      assert.deepEqual(await stock(BAMBOO), [5, 5]);
    });

    test("racing status saves always leave stock matching the final status", async () => {
      for (let round = 0; round < 8; round += 1) {
        const { id } = await createOrder([{ compositeId: COAL, quantity: 1 }]);
        await Promise.all([
          updateOrder(id, { status: CANCELLED }),
          updateOrder(id, { status: DONE }),
          updateOrder(id, { status: PROCESSING }),
        ]);
        const cancelled = (await statusOf(id)) === CANCELLED;
        assert.equal(await isReserved(id), !cancelled);
        await updateOrder(id, { status: CANCELLED });
        assert.deepEqual(await stock(COAL), [2, 2]);
      }
    });

    test("an odId shared by several products is rejected and compositeId still works", async () => {
      await db("products").insert({
        id: 20,
        name: "Twin",
        locale: "uk",
        price: 100,
        discount: 0,
        number_of: 5,
        category_id: 2,
        composite_id: "10-twin",
        od_id: 10,
      });
      const error = await assertRejected(
        createOrder([{ odId: 10, quantity: 1 }]),
        "INVALID_ORDER"
      );
      assert.match(error.message, /odId 10 matches several products/);
      assert.deepEqual(await stock(BAMBOO), [5, 5]);
      assert.deepEqual(await stock("10-twin"), [5]);
      await createOrder([{ compositeId: "10-twin", quantity: 1 }]);
      assert.deepEqual(await stock("10-twin"), [4]);
    });

    test("editing the items of an order that is not cancelled is rejected", async () => {
      const { id, data } = await createOrder([
        { compositeId: BAMBOO, quantity: 2 },
      ]);
      const edited = [{ ...data.order[0], quantity: 5 }];
      const error = await assertRejected(
        updateOrder(id, { order: edited }),
        "INVALID_ORDER"
      );
      assert.match(error.message, /Cancel the order and create a new one/);
      await assertRejected(
        updateOrder(id, { order: edited, status: CANCELLED }),
        "INVALID_ORDER"
      );
      await assertRejected(updateOrder(id, { order: [] }), "INVALID_ORDER");
      assert.equal(await statusOf(id), PROCESSING);
      assert.deepEqual(await stock(BAMBOO), [3, 3]);
    });

    test("saving an order with unchanged items is accepted whatever the representation", async () => {
      const { id, data } = await createOrder([
        { compositeId: BAMBOO, quantity: 2 },
      ]);
      await updateOrder(id, { order: data.order, name: "Renamed" });
      await updateOrder(id, { order: JSON.parse(JSON.stringify(data.order)) });
      await updateOrder(id, { order: JSON.stringify(data.order) });
      assert.deepEqual(await stock(BAMBOO), [3, 3]);
    });

    test("the items of a cancelled order can be edited while it stays cancelled", async () => {
      const { id, data } = await createOrder([
        { compositeId: BAMBOO, quantity: 2 },
      ]);
      await updateOrder(id, { status: CANCELLED });
      const edited = [{ ...data.order[0], quantity: 1 }];
      await updateOrder(id, { order: edited, status: CANCELLED });
      await updateOrder(id, { order: edited });
      assert.deepEqual(await stock(BAMBOO), [5, 5]);
      await assertRejected(
        updateOrder(id, {
          order: [{ ...edited[0], quantity: 3 }],
          status: DONE,
        }),
        "INVALID_ORDER"
      );
      assert.equal(await statusOf(id), CANCELLED);
    });

    test("the reserved flag follows the reservation and cannot be written by clients", async () => {
      const { id } = await createOrder([{ compositeId: COAL, quantity: 1 }], {
        stockReserved: true,
      });
      assert.equal(await isReserved(id), true);
      assert.deepEqual(await stock(COAL), [1, 1]);
      await updateOrder(id, { stockReserved: false });
      assert.equal(await isReserved(id), true);
      await updateOrder(id, { status: CANCELLED });
      assert.equal(await isReserved(id), false);
      assert.deepEqual(await stock(COAL), [2, 2]);
      await updateOrder(id, { status: PROCESSING });
      assert.equal(await isReserved(id), true);
      assert.deepEqual(await stock(COAL), [1, 1]);
    });

    test("an order created as cancelled is not reserved and un-cancelling reserves it", async () => {
      const { id } = await createOrder([{ compositeId: COAL, quantity: 1 }], {
        status: CANCELLED,
      });
      assert.equal(await isReserved(id), false);
      await updateOrder(id, { status: DONE });
      assert.equal(await isReserved(id), true);
      assert.deepEqual(await stock(COAL), [1, 1]);
    });

    test("cancelling an order that never reserved stock does not restock it", async () => {
      await db("orders").insert({
        id: 60,
        status: PROCESSING,
        stock_reserved: false,
        order: JSON.stringify([{ compositeId: COAL, quantity: 1 }]),
      });
      await updateOrder(60, { status: CANCELLED });
      assert.deepEqual(await stock(COAL), [2, 2]);
      assert.equal(await isReserved(60), false);
    });

    test("orders stored before the reserved flag existed follow their status", async () => {
      await db("orders").insert([
        {
          id: 61,
          status: PROCESSING,
          order: JSON.stringify([{ compositeId: COAL, quantity: 1 }]),
        },
        {
          id: 62,
          status: CANCELLED,
          order: JSON.stringify([{ compositeId: COAL, quantity: 1 }]),
        },
      ]);
      await updateOrder(61, { status: CANCELLED });
      assert.deepEqual(await stock(COAL), [3, 3]);
      await updateOrder(62, { status: PROCESSING });
      assert.deepEqual(await stock(COAL), [2, 2]);
      assert.equal(await isReserved(61), false);
      assert.equal(await isReserved(62), true);
    });

    test("marking an order notified sets the timestamp once and touches nothing else", async () => {
      const { id } = await createOrder([{ compositeId: BAMBOO, quantity: 2 }]);
      const before = await orderRow(id);
      const stockBefore = await stock(BAMBOO);
      let hooks = 0;
      const original = lifecycles.beforeUpdate;
      lifecycles.beforeUpdate = async (event) => {
        hooks += 1;
        return original(event);
      };
      try {
        assert.deepEqual(await markOrderNotified(strapi, id), {
          found: true,
          marked: true,
        });
        const first = await orderRow(id);
        assert.notEqual(first.notified_at, null);
        assert.deepEqual(await markOrderNotified(strapi, id), {
          found: true,
          marked: false,
        });
        assert.equal(
          String((await orderRow(id)).notified_at),
          String(first.notified_at)
        );
      } finally {
        lifecycles.beforeUpdate = original;
      }
      const after = await orderRow(id);
      assert.equal(hooks, 0);
      assert.equal(before.notified_at, null);
      assert.equal(after.status, before.status);
      assert.equal(after.order, before.order);
      assert.equal(Boolean(after.stock_reserved), true);
      assert.deepEqual(await stock(BAMBOO), stockBefore);
    });

    test("marking a cancelled order notified does not move stock or status", async () => {
      const { id } = await createOrder([{ compositeId: COAL, quantity: 1 }]);
      await updateOrder(id, { status: CANCELLED });
      assert.deepEqual(await stock(COAL), [2, 2]);
      await markOrderNotified(strapi, id);
      assert.equal(await statusOf(id), CANCELLED);
      assert.equal(await isReserved(id), false);
      assert.deepEqual(await stock(COAL), [2, 2]);
    });

    test("marking an unknown order reports that it was not found", async () => {
      assert.deepEqual(await markOrderNotified(strapi, 9999), {
        found: false,
        marked: false,
      });
    });

    test("the notify action validates the id and answers with the marked state", async () => {
      const { id } = await createOrder([{ compositeId: COAL, quantity: 1 }]);
      const controller = createOrderController({
        strapi: {
          ...strapi,
          contentType: () => ({
            uid: ORDER_UID,
            modelName: "order",
            kind: "collectionType",
            info: { singularName: "order" },
          }),
          service: () => ({}),
        },
      });
      const ctx = (idParam) => ({
        params: { id: idParam },
        badRequest: (message) => ({ status: 400, message }),
        notFound: (message) => ({ status: 404, message }),
      });
      assert.equal((await controller.markNotified(ctx("abc"))).status, 400);
      assert.equal((await controller.markNotified(ctx("0"))).status, 400);
      assert.equal((await controller.markNotified(ctx("9999"))).status, 404);
      assert.deepEqual(await controller.markNotified(ctx(String(id))), {
        data: { id, marked: true },
      });
      assert.deepEqual(await controller.markNotified(ctx(String(id))), {
        data: { id, marked: false },
      });
    });

    test("new orders start without a notification timestamp and keep the last name", async () => {
      const { id } = await createOrder([{ compositeId: COAL, quantity: 1 }], {
        lastName: "Petrenko",
      });
      const row = await orderRow(id);
      assert.equal(row.notified_at, null);
      assert.equal(row.last_name, "Petrenko");
    });

    test("an oversized last name is rejected before anything is reserved", async () => {
      await assertRejected(
        createOrder([{ compositeId: COAL, quantity: 1 }], {
          lastName: "x".repeat(256),
        }),
        "INVALID_ORDER"
      );
      assert.deepEqual(await stock(COAL), [2, 2]);
    });

    test("reserving stock for a row that cannot be found fails loudly", async () => {
      await assert.rejects(
        reserveStockForOrder(strapi, 4242),
        /Order 4242 was not found/
      );
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
