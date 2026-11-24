import assert from "node:assert/strict";
import { resolve } from "node:path";
import { afterEach, test } from "node:test";

import { load, src } from "./helpers/load-ts.mjs";

const { markOrderNotified } = load(resolve(src, "lib/strapi.ts"));

const originalFetch = globalThis.fetch;
const originalEnv = {
  STRAPI_URL: process.env.STRAPI_URL,
  API_TOKEN: process.env.API_TOKEN
};
afterEach(() => {
  globalThis.fetch = originalFetch;
  for (const [name, value] of Object.entries(originalEnv)) {
    if (value === undefined) delete process.env[name];
    else process.env[name] = value;
  }
});

test("marking an order notified posts to its own action with the server token", async () => {
  process.env.STRAPI_URL = "http://strapi.test";
  process.env.API_TOKEN = "test-token";
  const requests = [];
  globalThis.fetch = async (url, init) => {
    requests.push({ url, init });
    return { ok: true, status: 200 };
  };
  await markOrderNotified("12/../x", 1500);
  assert.equal(requests.length, 1);
  assert.equal(
    requests[0].url,
    "http://strapi.test/api/orders/12%2F..%2Fx/mark-notified"
  );
  assert.equal(requests[0].init.method, "POST");
  assert.equal(requests[0].init.body, undefined);
  assert.equal(requests[0].init.headers.Authorization, "Bearer test-token");
  assert.ok(requests[0].init.signal instanceof AbortSignal);
});

test("a refused mark is reported as an error", async () => {
  globalThis.fetch = async () => ({ ok: false, status: 403 });
  await assert.rejects(markOrderNotified("7"), /403/);
});
