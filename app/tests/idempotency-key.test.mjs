import assert from "node:assert/strict";
import { resolve } from "node:path";
import { test } from "node:test";

import { load, src } from "./helpers/load-ts.mjs";

const { shouldKeepIdempotencyKey } = load(
  resolve(src, "utils/helpers/shouldKeepIdempotencyKey.ts")
);

test("the key is dropped after success and after definitive client errors", () => {
  for (const status of [200, 400, 409, 422]) {
    assert.equal(shouldKeepIdempotencyKey(status, "OUT_OF_STOCK"), false);
  }
});

test("the key is kept after timeouts, server errors and rate limiting", () => {
  for (const status of [413, 429, 500, 502, 503, 504]) {
    assert.equal(shouldKeepIdempotencyKey(status), true);
  }
});

test("the key is kept while the earlier attempt is still being processed", () => {
  assert.equal(shouldKeepIdempotencyKey(409, "ORDER_IN_PROGRESS"), true);
  assert.equal(shouldKeepIdempotencyKey(409, "IDEMPOTENCY_CONFLICT"), false);
});
