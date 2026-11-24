import assert from "node:assert/strict";
import { resolve } from "node:path";
import { test } from "node:test";

import { load, mocks, src } from "./helpers/load-ts.mjs";

const sent = [];
const connects = [];
class FakeClient {
  connected = false;
  async connect() {
    connects.push(true);
    this.connected = true;
  }
  async sendMessage(dialog, options) {
    sent.push({ dialog, options });
  }
}
mocks.set("telegram", { TelegramClient: FakeClient });
mocks.set("telegram/sessions", { StringSession: class {} });
mocks.set("@/utils/config", {
  env: {
    SESSION_TOKEN: "",
    API_ID: "1",
    API_HASH: "hash",
    CHANNEL_ID: "n-1001"
  }
});

const telegram = load(resolve(src, "lib/telegram.ts"));

test("the send allowance leaves room for a cold connection", () => {
  assert.equal(telegram.NOTIFY_TIMEOUT_MS, 8000);
});

test("every part is delivered in order over one connection", async () => {
  await telegram.sendTelegramMessages(["one", "two", "three"]);
  assert.deepEqual(
    sent.map(({ options }) => options.message),
    ["one", "two", "three"]
  );
  assert.ok(sent.every(({ options }) => options.parseMode === "md2"));
  assert.equal(connects.length, 1);
});
