"use strict";

const { errors } = require("@strapi/utils");

const PRODUCT_UID = "api::product.product";
const PROMOCODE_UID = "api::promocode.promocode";
const MAX_ORDER_ITEMS = 100;
const MAX_ITEM_QUANTITY = 1000;
const CANCELLED_STATUS = "Скасовано";

const ERROR_CODES = {
  invalidOrder: "INVALID_ORDER",
  outOfStock: "OUT_OF_STOCK",
  promocodeInvalid: "PROMOCODE_INVALID",
};

const isPositiveInteger = (value) =>
  Number.isInteger(value) && value > 0 && value <= MAX_ITEM_QUANTITY;

const toInteger = (value) => {
  const number = typeof value === "string" ? Number(value) : value;
  return Number.isInteger(number) ? number : null;
};

const invalidOrder = (message = "Order items are invalid") =>
  new errors.ValidationError(message, { code: ERROR_CODES.invalidOrder });

const normalizeItems = (rawItems) => {
  if (
    !Array.isArray(rawItems) ||
    rawItems.length === 0 ||
    rawItems.length > MAX_ORDER_ITEMS
  ) {
    throw invalidOrder();
  }
  const quantities = new Map();
  for (const item of rawItems) {
    const odId = toInteger(item?.odId);
    if (odId === null || !isPositiveInteger(item?.quantity)) {
      throw invalidOrder();
    }
    quantities.set(odId, (quantities.get(odId) || 0) + item.quantity);
  }
  return [...quantities.entries()]
    .map(([odId, quantity]) => ({ odId, quantity }))
    .sort((a, b) => a.odId - b.odId);
};

const getTable = (strapi) => {
  const meta = strapi.db.metadata.get(PRODUCT_UID);
  const schema = strapi.db.getSchemaName?.();
  const column = (attribute) => meta.attributes[attribute].columnName;
  return {
    name: meta.tableName,
    schema,
    odId: column("odId"),
    numberOf: column("numberOf"),
  };
};

const tableOf = (db, table) =>
  table.schema ? db(table.name).withSchema(table.schema) : db(table.name);

const pickCanonicalRows = (rows) => {
  const byOdId = new Map();
  for (const row of rows) {
    const current = byOdId.get(row.odId);
    const isPreferred =
      !current ||
      (row.locale === "uk" && current.locale !== "uk") ||
      (row.locale === current.locale && row.id < current.id);
    if (isPreferred) byOdId.set(row.odId, row);
  }
  return byOdId;
};

const loadProducts = async (strapi, items) => {
  const rows = await strapi.db.query(PRODUCT_UID).findMany({
    where: { odId: { $in: items.map((item) => item.odId) } },
    populate: { category: true },
  });
  return pickCanonicalRows(rows);
};

const unavailableDetails = (item, product, available = 0) => ({
  odId: item.odId,
  name: product?.name ?? null,
  requested: item.quantity,
  available: Math.max(0, available),
});

const throwOutOfStock = (items) => {
  const names = items.map((item) => item.name || `#${item.odId}`).join(", ");
  throw new errors.ApplicationError(`Not enough stock for: ${names}`, {
    code: ERROR_CODES.outOfStock,
    items,
  });
};

const resolvePromocode = async (strapi, name, amount) => {
  if (name === undefined || name === null || name === "") return null;
  const fail = () => {
    throw new errors.ApplicationError("Promocode is not valid", {
      code: ERROR_CODES.promocodeInvalid,
    });
  };
  if (typeof name !== "string") fail();
  const promocode = await strapi.db.query(PROMOCODE_UID).findOne({
    where: { name, publishedAt: { $notNull: true } },
    populate: { categories: true },
  });
  const now = Date.now();
  const isActive =
    promocode &&
    promocode.numberOfUses > 0 &&
    now >= new Date(promocode.dateStart).getTime() &&
    now <= new Date(promocode.dateEnd).getTime() &&
    Number(promocode.minAmount || 0) <= amount;
  if (!isActive) fail();
  return {
    name: promocode.name,
    discount: Number(promocode.discount) || 0,
    categories: new Set((promocode.categories || []).map((item) => item.name)),
  };
};

const buildOrderItems = (items, products, promocode) =>
  items.map((item) => {
    const product = products.get(item.odId);
    const price = Number(product.price);
    const productDiscount = Number(product.discount) || 0;
    const applyPromocode =
      promocode && promocode.categories.has(product.category?.name);
    return {
      id: product.id,
      odId: item.odId,
      name: product.name,
      price,
      discount: applyPromocode ? promocode.discount : productDiscount,
      quantity: item.quantity,
    };
  });

class StockShortage extends Error {}

const reserveStock = async (strapi, items) => {
  const table = getTable(strapi);
  const shortages = [];
  const remaining = new Map();

  try {
    await strapi.db.connection.transaction(async (trx) => {
      for (const item of items) {
        const rows = await tableOf(trx, table)
          .where(table.odId, item.odId)
          .forUpdate()
          .select(table.numberOf);
        const updated = await tableOf(trx, table)
          .where(table.odId, item.odId)
          .andWhere(table.numberOf, ">=", item.quantity)
          .update({
            [table.numberOf]: trx.raw("?? - ?", [
              table.numberOf,
              item.quantity,
            ]),
          });
        const stock = rows.map((row) => Number(row[table.numberOf]));
        if (rows.length === 0 || updated !== rows.length) {
          shortages.push({ item, available: Math.min(...stock, Infinity) });
        } else {
          remaining.set(item.odId, Math.min(...stock) - item.quantity);
        }
      }
      if (shortages.length) throw new StockShortage();
    });
  } catch (error) {
    if (!(error instanceof StockShortage)) throw error;
    const products = await loadProducts(
      strapi,
      shortages.map(({ item }) => item)
    );
    throwOutOfStock(
      shortages.map(({ item, available }) =>
        unavailableDetails(
          item,
          products.get(item.odId),
          Number.isFinite(available) ? available : 0
        )
      )
    );
  }
  return remaining;
};

const releaseStock = async (strapi, items) => {
  const table = getTable(strapi);
  await strapi.db.connection.transaction(async (trx) => {
    for (const item of items) {
      await tableOf(trx, table)
        .where(table.odId, item.odId)
        .update({
          [table.numberOf]: trx.raw("?? + ?", [table.numberOf, item.quantity]),
        });
    }
  });
};

const prepareOrderData = async (strapi, data) => {
  const items = normalizeItems(data.order);
  const products = await loadProducts(strapi, items);
  const missing = items.filter((item) => !products.has(item.odId));
  if (missing.length) {
    throwOutOfStock(missing.map((item) => unavailableDetails(item, null)));
  }
  const amount = items.reduce((sum, item) => {
    const product = products.get(item.odId);
    return sum + Math.floor(Number(product.price) * item.quantity);
  }, 0);
  const promocode = await resolvePromocode(strapi, data.promocode, amount);
  const orderItems = buildOrderItems(items, products, promocode);
  const remaining = await reserveStock(strapi, items);
  data.order = orderItems.map((item) => ({
    ...item,
    numberOf: remaining.get(item.odId),
  }));
  data.promocode = promocode ? promocode.name : null;
  data.promocodeDiscount = promocode ? promocode.discount : 0;
};

const getRestockItems = (order) => {
  if (!Array.isArray(order)) return [];
  const quantities = new Map();
  for (const item of order) {
    const odId = toInteger(item?.odId);
    const quantity = toInteger(item?.quantity);
    if (odId !== null && quantity !== null && quantity > 0) {
      quantities.set(odId, (quantities.get(odId) || 0) + quantity);
    }
  }
  return [...quantities.entries()]
    .map(([odId, quantity]) => ({ odId, quantity }))
    .sort((a, b) => a.odId - b.odId);
};

module.exports = {
  CANCELLED_STATUS,
  ERROR_CODES,
  normalizeItems,
  prepareOrderData,
  releaseStock,
  getRestockItems,
};
