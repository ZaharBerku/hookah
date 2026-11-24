import assert from "node:assert/strict";
import { resolve } from "node:path";
import { test } from "node:test";

import { load, src } from "./helpers/load-ts.mjs";

const { isInStock, getAvailableQuantity } = load(
  resolve(src, "utils/helpers/stock.ts")
);

test("only a positive stock counts as in stock", () => {
  assert.equal(isInStock(1), true);
  assert.equal(isInStock(41), true);
  assert.equal(isInStock("3"), true);
  for (const value of [0, -1, -41, null, undefined, NaN, "", "abc"]) {
    assert.equal(isInStock(value), false, String(value));
  }
});

test("available quantity is never negative", () => {
  assert.equal(getAvailableQuantity(5), 5);
  assert.equal(getAvailableQuantity(2.9), 2);
  for (const value of [0, -41, null, undefined, NaN]) {
    assert.equal(getAvailableQuantity(value), 0, String(value));
  }
});
