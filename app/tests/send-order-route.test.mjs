import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { test } from "node:test";

import { load, mocks, src } from "./helpers/load-ts.mjs";

const require = createRequire(import.meta.url);
const { NextRequest } = require("next/server");

let graphqlCalls = 0;
mocks.set("@/lib/strapi", {
  strapiGraphql: async () => {
    graphqlCalls += 1;
    return { errors: [{ message: "offline" }] };
  }
});
mocks.set("@/lib/telegram", { sendTelegramMessage: async () => {} });
let clientIp = "1.2.3.4";
mocks.set("@/utils/helpers/getClientIp", { getClientIp: () => clientIp });

const { POST } = load(resolve(src, "app/api/sendOrder/route.ts"));

const post = (body, headers = {}) =>
  POST(
    new NextRequest("http://localhost/api/sendOrder", {
      method: "POST",
      body,
      headers
    })
  );

test("oversized bodies are rejected before parsing", async () => {
  const response = await post(JSON.stringify({ pad: "x".repeat(25_000) }));
  assert.equal(response.status, 413);
  assert.equal(graphqlCalls, 0);
});

test("malformed JSON is a validation error", async () => {
  const response = await post("{not json");
  assert.equal(response.status, 400);
  assert.equal((await response.json()).error, "INVALID_ORDER");
});

test("an address is limited to five orders per window", async () => {
  clientIp = "5.6.7.8";
  const statuses = [];
  for (let index = 0; index < 5; index += 1) {
    statuses.push((await post("{}")).status);
  }
  const blocked = await post("{}");
  assert.deepEqual(statuses, [400, 400, 400, 400, 400]);
  clientIp = "9.9.9.9";
  assert.equal((await post("{}")).status, 400);
  clientIp = "5.6.7.8";
  assert.equal(blocked.status, 429);
  assert.deepEqual(await blocked.json(), { error: "RATE_LIMITED" });
  assert.ok(Number(blocked.headers.get("retry-after")) > 0);
});
