"use strict";

const { errors } = require("@strapi/utils");

const PRODUCT_UID = "api::product.product";
const ORDER_UID = "api::order.order";
const PROMOCODE_UID = "api::promocode.promocode";
const MAX_ORDER_ITEMS = 20;
const MAX_ITEM_QUANTITY = 20;
const MAX_COMPOSITE_ID_LENGTH = 200;
const CANCELLED_STATUS = "Скасовано";

const STRING_FIELD_LIMITS = {
  name: 255,
  phoneNumber: 255,
  idempotencyKey: 255,
  address: 1000,
  department: 1000,
};

const ERROR_CODES = {
  invalidOrder: "INVALID_ORDER",
  outOfStock: "OUT_OF_STOCK",
  promocodeInvalid: "PROMOCODE_INVALID",
};

const isValidQuantity = (value) =>
  Number.isInteger(value) && value > 0 && value <= MAX_ITEM_QUANTITY;

const toInteger = (value) => {
  const number = typeof value === "string" ? Number(value) : value;
  return Number.isInteger(number) ? number : null;
};

const invalidOrder = (message = "Order is invalid") =>
  new errors.ValidationError(message, { code: ERROR_CODES.invalidOrder });

const validateFields = (data) => {
  for (const [field, max] of Object.entries(STRING_FIELD_LIMITS)) {
    const value = data[field];
    if (value === undefined || value === null) continue;
    if (typeof value !== "string" || value.length > max) {
      throw invalidOrder(`Order field "${field}" is invalid`);
    }
  }
};

const normalizeItems = (rawItems) => {
  if (
    !Array.isArray(rawItems) ||
    rawItems.length === 0 ||
    rawItems.length > MAX_ORDER_ITEMS
  ) {
    throw invalidOrder("Order items are invalid");
  }
  return rawItems.map((item) => {
    if (!isValidQuantity(item?.quantity)) {
      throw invalidOrder("Order items are invalid");
    }
    const { compositeId } = item;
    if (
      typeof compositeId === "string" &&
      compositeId.length > 0 &&
      compositeId.length <= MAX_COMPOSITE_ID_LENGTH
    ) {
      return { compositeId, quantity: item.quantity };
    }
    const odId = toInteger(item.odId);
    if (compositeId === undefined && odId !== null) {
      return { odId, quantity: item.quantity };
    }
    throw invalidOrder("Order items are invalid");
  });
};

const getTable = (strapi, uid, attributes) => {
  const meta = strapi.db.metadata.get(uid);
  return {
    name: meta.tableName,
    schema: strapi.db.getSchemaName?.(),
    columns: Object.fromEntries(
      attributes.map((attribute) => [
        attribute,
        meta.attributes[attribute].columnName,
      ])
    ),
  };
};

const getProductTable = (strapi) =>
  getTable(strapi, PRODUCT_UID, ["compositeId", "odId", "numberOf"]);

const getOrderTable = (strapi) =>
  getTable(strapi, ORDER_UID, ["status", "order"]);

const tableOf = (db, table) =>
  table.schema ? db(table.name).withSchema(table.schema) : db(table.name);

const pickCanonicalRows = (rows) => {
  const byCompositeId = new Map();
  for (const row of rows) {
    if (!row.compositeId) continue;
    const current = byCompositeId.get(row.compositeId);
    const isPreferred =
      !current ||
      (row.locale === "uk" && current.locale !== "uk") ||
      (row.locale === current.locale && row.id < current.id);
    if (isPreferred) byCompositeId.set(row.compositeId, row);
  }
  return byCompositeId;
};

const loadProductRows = async (strapi, items) => {
  const compositeIds = items.flatMap((item) => item.compositeId ?? []);
  const odIds = items.flatMap((item) => item.odId ?? []);
  const conditions = [];
  if (compositeIds.length) {
    conditions.push({ compositeId: { $in: compositeIds } });
  }
  if (odIds.length) conditions.push({ odId: { $in: odIds } });
  return strapi.db.query(PRODUCT_UID).findMany({
    where: { $or: conditions },
    populate: { category: true },
  });
};

const resolveItems = async (strapi, rawItems) => {
  const requested = normalizeItems(rawItems);
  const rows = await loadProductRows(strapi, requested);
  const byCompositeId = pickCanonicalRows(rows);
  const byOdId = new Map();
  for (const row of rows) {
    if (row.odId != null && byCompositeId.has(row.compositeId)) {
      byOdId.set(row.odId, byCompositeId.get(row.compositeId));
    }
  }

  const merged = new Map();
  const missing = [];
  for (const item of requested) {
    const product =
      item.compositeId !== undefined
        ? byCompositeId.get(item.compositeId)
        : byOdId.get(item.odId);
    if (!product) {
      missing.push(item);
      continue;
    }
    const current = merged.get(product.compositeId);
    merged.set(product.compositeId, {
      product,
      quantity: (current?.quantity || 0) + item.quantity,
    });
  }
  if (missing.length) {
    throw outOfStockError(missing.map((item) => unavailableDetails(item)));
  }
  const items = [...merged.values()].sort((a, b) =>
    a.product.compositeId < b.product.compositeId ? -1 : 1
  );
  if (items.some((item) => item.quantity > MAX_ITEM_QUANTITY)) {
    throw invalidOrder("Order items are invalid");
  }
  return items;
};

const unavailableDetails = (item, available = 0) => ({
  compositeId: item.compositeId ?? null,
  odId: item.odId ?? null,
  name: item.name ?? null,
  requested: item.quantity,
  available: Math.max(0, available),
});

const outOfStockError = (items, message = "Not enough stock for") => {
  const names = items
    .map((item) => item.name || item.compositeId || `#${item.odId}`)
    .join(", ");
  return new errors.ApplicationError(`${message}: ${names}`, {
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

const buildOrderItems = (items, promocode) =>
  items.map(({ product, quantity }) => {
    const productDiscount = Number(product.discount) || 0;
    const applyPromocode =
      promocode && promocode.categories.has(product.category?.name);
    return {
      id: product.id,
      compositeId: product.compositeId,
      odId: product.odId ?? null,
      name: product.name,
      price: Number(product.price),
      discount: applyPromocode ? promocode.discount : productDiscount,
      quantity,
    };
  });

const parseOrderItems = (order) => {
  if (typeof order !== "string") return order;
  try {
    return JSON.parse(order);
  } catch {
    return null;
  }
};

const getStockItems = (order) => {
  const parsed = parseOrderItems(order);
  if (!Array.isArray(parsed)) return [];
  const merged = new Map();
  for (const item of parsed) {
    const quantity = toInteger(item?.quantity);
    if (quantity === null || quantity <= 0) continue;
    const odId = toInteger(item?.odId);
    const hasCompositeId =
      typeof item?.compositeId === "string" && item.compositeId.length > 0;
    if (!hasCompositeId && odId === null) continue;
    const key = hasCompositeId ? `c:${item.compositeId}` : `o:${odId}`;
    const current = merged.get(key);
    merged.set(key, {
      ...(hasCompositeId ? { compositeId: item.compositeId } : { odId }),
      name: current?.name ?? item.name ?? null,
      quantity: (current?.quantity || 0) + quantity,
    });
  }
  return [...merged.entries()]
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([, item]) => item);
};

class StockShortage extends Error {}

const stockRows = (trx, table, item) => {
  const column =
    item.compositeId !== undefined
      ? table.columns.compositeId
      : table.columns.odId;
  return tableOf(trx, table).where(column, item.compositeId ?? item.odId);
};

const reserveInTransaction = async (trx, table, items) => {
  const shortages = [];
  for (const item of items) {
    const rows = await stockRows(trx, table, item)
      .forUpdate()
      .select(table.columns.numberOf);
    const updated = await stockRows(trx, table, item)
      .andWhere(table.columns.numberOf, ">=", item.quantity)
      .update({
        [table.columns.numberOf]: trx.raw("?? - ?", [
          table.columns.numberOf,
          item.quantity,
        ]),
      });
    if (rows.length === 0 || updated !== rows.length) {
      const stock = rows.map((row) => Number(row[table.columns.numberOf]));
      shortages.push({
        item,
        available: rows.length ? Math.min(...stock) : 0,
      });
    }
  }
  return shortages;
};

const releaseInTransaction = async (trx, table, items) => {
  for (const item of items) {
    await stockRows(trx, table, item).update({
      [table.columns.numberOf]: trx.raw("?? + ?", [
        table.columns.numberOf,
        item.quantity,
      ]),
    });
  }
};

const shortageError = (shortages, message) =>
  outOfStockError(
    shortages.map(({ item, available }) => unavailableDetails(item, available)),
    message
  );

const reserveStockForOrder = async (strapi, order) => {
  const items = getStockItems(order);
  const table = getProductTable(strapi);
  let shortages = [];
  try {
    await strapi.db.connection.transaction(async (trx) => {
      shortages = await reserveInTransaction(trx, table, items);
      if (shortages.length) throw new StockShortage();
    });
  } catch (error) {
    if (!(error instanceof StockShortage)) throw error;
    throw shortageError(shortages);
  }
};

const prepareOrderData = async (strapi, data) => {
  validateFields(data);
  const items = await resolveItems(strapi, data.order);
  const amount = items.reduce(
    (sum, { product, quantity }) =>
      sum + Math.floor(Number(product.price) * quantity),
    0
  );
  const promocode = await resolvePromocode(strapi, data.promocode, amount);
  data.order = buildOrderItems(items, promocode);
  data.promocode = promocode ? promocode.name : null;
  data.promocodeDiscount = promocode ? promocode.discount : 0;
};

const resolveOrderId = async (strapi, where) => {
  if (where?.id !== undefined) return where.id;
  const order = await strapi.db.query(ORDER_UID).findOne({ where });
  return order?.id;
};

const syncStockWithStatus = async (strapi, where, nextStatus) => {
  if (nextStatus === undefined) return;
  const orderId = await resolveOrderId(strapi, where);
  if (orderId === undefined || orderId === null) return;
  const orders = getOrderTable(strapi);
  const products = getProductTable(strapi);
  let shortages = [];
  try {
    await strapi.db.connection.transaction(async (trx) => {
      const row = await tableOf(trx, orders)
        .where("id", orderId)
        .forUpdate()
        .first(orders.columns.status, orders.columns.order);
      if (!row) return;
      const wasCancelled = row[orders.columns.status] === CANCELLED_STATUS;
      const willBeCancelled = nextStatus === CANCELLED_STATUS;
      if (wasCancelled === willBeCancelled) return;
      const items = getStockItems(row[orders.columns.order]);
      if (willBeCancelled) {
        await releaseInTransaction(trx, products, items);
      } else {
        shortages = await reserveInTransaction(trx, products, items);
        if (shortages.length) throw new StockShortage();
      }
      await tableOf(trx, orders)
        .where("id", orderId)
        .update({ [orders.columns.status]: nextStatus });
    });
  } catch (error) {
    if (!(error instanceof StockShortage)) throw error;
    throw shortageError(shortages, "Cannot restore the order, not enough stock");
  }
};

module.exports = {
  ORDER_UID,
  CANCELLED_STATUS,
  ERROR_CODES,
  MAX_ORDER_ITEMS,
  MAX_ITEM_QUANTITY,
  normalizeItems,
  getStockItems,
  prepareOrderData,
  reserveStockForOrder,
  syncStockWithStatus,
};
