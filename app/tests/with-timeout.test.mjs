import assert from "node:assert/strict";
import { resolve } from "node:path";
import { test } from "node:test";

import { load, src } from "./helpers/load-ts.mjs";

const { withTimeout } = load(resolve(src, "lib/withTimeout.ts"));

test("a slow operation is rejected once the timeout passes", async () => {
  const never = new Promise(() => {});
  await assert.rejects(withTimeout(never, 20, "timed out"), /timed out/);
});

test("a fast operation keeps its result and its rejection", async () => {
  assert.equal(await withTimeout(Promise.resolve("sent"), 1000, "x"), "sent");
  await assert.rejects(
    withTimeout(Promise.reject(new Error("boom")), 1000, "x"),
    /boom/
  );
});

test("an operation that fails after the timeout does not raise an unhandled rejection", async () => {
  const unhandled = [];
  const listener = (reason) => unhandled.push(reason);
  process.on("unhandledRejection", listener);
  const late = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("late")), 40)
  );
  await assert.rejects(withTimeout(late, 10, "timed out"), /timed out/);
  await new Promise((done) => setTimeout(done, 80));
  process.off("unhandledRejection", listener);
  assert.deepEqual(unhandled, []);
});
