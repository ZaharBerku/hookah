import assert from "node:assert/strict";
import { resolve } from "node:path";
import { afterEach, beforeEach, test } from "node:test";

import { load, src } from "./helpers/load-ts.mjs";

const {
  clearPendingOrderKey,
  prepareOrderAttempt,
  readPendingOrderKey,
  savePendingOrderKey
} = load(resolve(src, "utils/helpers/pendingOrder.ts"));

const memoryStorage = () => {
  const values = new Map();
  return {
    values,
    getItem: (key) => (values.has(key) ? values.get(key) : null),
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key)
  };
};

let storage;
beforeEach(() => {
  storage = memoryStorage();
  globalThis.window = { sessionStorage: storage };
});
afterEach(() => {
  delete globalThis.window;
});

test("a pending key survives a reload and is cleared on demand", () => {
  savePendingOrderKey("key-1234567890");
  assert.equal(readPendingOrderKey(), "key-1234567890");
  clearPendingOrderKey();
  assert.equal(readPendingOrderKey(), null);
});

test("a stale or corrupt entry is ignored", () => {
  savePendingOrderKey("key-1234567890", 1000);
  assert.equal(readPendingOrderKey(1000 + 31 * 60 * 1000), null);
  assert.equal(storage.values.size, 0);
  storage.setItem("pendingOrderKey", "{broken");
  assert.equal(readPendingOrderKey(), null);
  storage.setItem("pendingOrderKey", JSON.stringify({ key: 5, savedAt: 1 }));
  assert.equal(readPendingOrderKey(), null);
});

test("everything keeps working when storage is unavailable", async () => {
  const broken = () => {
    throw new Error("blocked");
  };
  globalThis.window = {
    sessionStorage: { getItem: broken, setItem: broken, removeItem: broken }
  };
  assert.equal(readPendingOrderKey(), null);
  assert.doesNotThrow(() => savePendingOrderKey("key-1234567890"));
  assert.doesNotThrow(() => clearPendingOrderKey());
  const key = await prepareOrderAttempt({
    current: null,
    checkStock: async () => true,
    createKey: () => "fresh-key-123"
  });
  assert.equal(key, "fresh-key-123");

  delete globalThis.window;
  assert.equal(readPendingOrderKey(), null);
  assert.doesNotThrow(() => savePendingOrderKey("key-1234567890"));
});

test("a pending key is resent before the stock check", async () => {
  savePendingOrderKey("pending-key-123");
  let stockChecks = 0;
  const key = await prepareOrderAttempt({
    current: null,
    checkStock: async () => {
      stockChecks += 1;
      return false;
    },
    createKey: () => "never-used-key"
  });
  assert.equal(key, "pending-key-123");
  assert.equal(stockChecks, 0);
});

test("a key kept in memory is also resent without the stock check", async () => {
  const key = await prepareOrderAttempt({
    current: "in-memory-key-1",
    checkStock: async () => assert.fail("stock must not be checked"),
    createKey: () => "never-used-key"
  });
  assert.equal(key, "in-memory-key-1");
  assert.equal(readPendingOrderKey(), "in-memory-key-1");
});

test("a first attempt checks stock, then stores the new key", async () => {
  let stockChecks = 0;
  const key = await prepareOrderAttempt({
    current: null,
    checkStock: async () => {
      stockChecks += 1;
      return true;
    },
    createKey: () => "fresh-key-123"
  });
  assert.equal(key, "fresh-key-123");
  assert.equal(stockChecks, 1);
  assert.equal(readPendingOrderKey(), "fresh-key-123");
});

test("a blocked first attempt stores nothing", async () => {
  const key = await prepareOrderAttempt({
    current: null,
    checkStock: async () => false,
    createKey: () => "fresh-key-123"
  });
  assert.equal(key, null);
  assert.equal(readPendingOrderKey(), null);
});
