import assert from "node:assert/strict";
import { resolve } from "node:path";
import { test } from "node:test";

import { load, src } from "./helpers/load-ts.mjs";

const { createRateLimiter } = load(resolve(src, "lib/rateLimit.ts"));

test("allows the limit per window and reports when to retry", () => {
  const limiter = createRateLimiter({ limit: 3, windowMs: 1000 });
  for (let index = 0; index < 3; index += 1) {
    assert.equal(limiter.check("a", 100 + index).allowed, true);
  }
  const blocked = limiter.check("a", 500);
  assert.equal(blocked.allowed, false);
  assert.equal(blocked.retryAfterSeconds, 1);
  assert.equal(limiter.check("b", 500).allowed, true);
});

test("requests are allowed again after the window passes", () => {
  const limiter = createRateLimiter({ limit: 1, windowMs: 1000 });
  assert.equal(limiter.check("a", 0).allowed, true);
  assert.equal(limiter.check("a", 999).allowed, false);
  assert.equal(limiter.check("a", 1001).allowed, true);
});

test("blocked attempts do not extend the block", () => {
  const limiter = createRateLimiter({ limit: 1, windowMs: 1000 });
  limiter.check("a", 0);
  for (let now = 100; now < 900; now += 100) limiter.check("a", now);
  assert.equal(limiter.check("a", 1001).allowed, true);
});

test("memory stays bounded when many distinct keys arrive", () => {
  const limiter = createRateLimiter({ limit: 1, windowMs: 1000, maxKeys: 10 });
  for (let index = 0; index < 100; index += 1) {
    assert.equal(limiter.check(`ip-${index}`, 0).allowed, true);
  }
  assert.equal(limiter.check("ip-99", 1).allowed, false);
});

test("a released slot frees the allowance once", () => {
  const limiter = createRateLimiter({ limit: 2, windowMs: 1000 });
  const first = limiter.check("a", 0);
  limiter.check("a", 0);
  assert.equal(limiter.check("a", 1).allowed, false);
  first.release();
  first.release();
  assert.equal(limiter.check("a", 2).allowed, true);
  assert.equal(limiter.check("a", 3).allowed, false);
});
