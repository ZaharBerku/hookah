import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

import { appRequire, createLoader, src } from "./support/load-tsx.mjs";

const React = appRequire("react");
const { renderToStaticMarkup } = appRequire("react-dom/server");

const messages = JSON.parse(
  readFileSync(
    fileURLToPath(new URL("../messages/uk.json", import.meta.url)),
    "utf8"
  )
);

const load = createLoader({
  "next-intl/server": {
    getTranslations:
      async ({ namespace }) =>
      (key) =>
        messages[namespace][key]
  },
  "@/componets/atoms": {
    Button: ({ children, full, color, ...props }) =>
      React.createElement("button", props, children)
  }
});

const {
  ADULT_ATTRIBUTE,
  AGE_GATE_ACTIONS_SCRIPT,
  AGE_GATE_INIT_SCRIPT,
  LEAVE_URL
} = load(resolve(src, "componets/organisms/AgeGate/script.ts"));
const { AgeGate } = load(resolve(src, "componets/organisms/AgeGate/index.tsx"));

const runInit = (cookie) => {
  const attributes = {};
  const observers = [];
  const documentElement = {
    hasAttribute: (name) => name in attributes,
    setAttribute: (name, value) => (attributes[name] = value)
  };
  class MutationObserver {
    constructor(callback) {
      this.callback = callback;
    }
    observe(target, options) {
      observers.push({ callback: this.callback, target, options });
    }
  }
  new Function("document", "MutationObserver", AGE_GATE_INIT_SCRIPT)(
    { cookie, documentElement },
    MutationObserver
  );
  return { attributes, observers, documentElement };
};

const setUpActions = () => {
  const attributes = {};
  const listeners = [];
  const document = {
    cookie: "",
    documentElement: {
      setAttribute: (name, value) => (attributes[name] = value)
    }
  };
  const window = {
    location: { href: "about:blank" },
    addEventListener: (type, handler, capture) =>
      listeners.push({ type, handler, capture })
  };
  new Function("document", "window", AGE_GATE_ACTIONS_SCRIPT)(document, window);
  const click = (...matching) =>
    listeners[0].handler({
      target: { closest: (selector) => matching.includes(selector) || null }
    });
  return { attributes, document, window, click, listeners };
};

test("the init script marks the document only for the is_adult=true cookie", () => {
  for (const cookie of ["is_adult=true", "a=1; is_adult=true; b=2"]) {
    assert.deepEqual(
      runInit(cookie).attributes,
      { [ADULT_ATTRIBUTE]: "" },
      cookie
    );
  }
  for (const cookie of [
    "",
    "is_adult=false",
    "xis_adult=true",
    "is_adult=truex",
    "a=is_adult=true"
  ]) {
    assert.deepEqual(runInit(cookie).attributes, {}, cookie);
  }
});

test("the init script restores the mark when the document element loses it", () => {
  const confirmed = runInit("is_adult=true");
  assert.equal(confirmed.observers.length, 1);
  assert.equal(confirmed.observers[0].target, confirmed.documentElement);
  assert.deepEqual(confirmed.observers[0].options, {
    attributes: true,
    attributeFilter: [ADULT_ATTRIBUTE]
  });
  delete confirmed.attributes[ADULT_ATTRIBUTE];
  confirmed.observers[0].callback();
  assert.deepEqual(confirmed.attributes, { [ADULT_ATTRIBUTE]: "" });

  const visitor = runInit("");
  visitor.observers[0].callback();
  assert.deepEqual(visitor.attributes, {});
});

test("yes stores the session cookie and reveals the page", () => {
  const { attributes, document, window, click } = setUpActions();
  click("#age-gate", "[data-age-yes]", "[role=dialog]");
  assert.equal(document.cookie, "is_adult=true; path=/");
  assert.deepEqual(attributes, { [ADULT_ATTRIBUTE]: "" });
  assert.equal(window.location.href, "about:blank");
});

test("no and a click outside the dialog leave the site", () => {
  for (const matching of [
    ["#age-gate", "[data-age-no]", "[role=dialog]"],
    ["#age-gate"]
  ]) {
    const { attributes, document, window, click } = setUpActions();
    click(...matching);
    assert.equal(window.location.href, LEAVE_URL);
    assert.equal(document.cookie, "");
    assert.deepEqual(attributes, {});
  }
});

test("clicks on the dialog body or outside the gate do nothing", () => {
  for (const matching of [["#age-gate", "[role=dialog]"], []]) {
    const { attributes, document, window, click } = setUpActions();
    click(...matching);
    assert.equal(window.location.href, "about:blank");
    assert.equal(document.cookie, "");
    assert.deepEqual(attributes, {});
  }
});

test("the click handler runs before any listener that can stop the event", () => {
  const { listeners } = setUpActions();
  assert.equal(listeners.length, 1);
  assert.equal(listeners[0].type, "click");
  assert.equal(listeners[0].capture, true);
});

test("the gate renders as static dialog markup with working controls", async () => {
  const html = renderToStaticMarkup(await AgeGate({ locale: "uk" }));
  assert.match(html, /^<div id="age-gate"/);
  assert.match(html, /role="dialog"/);
  assert.match(html, /aria-modal="true"/);
  assert.equal(html.match(/<button[^>]*data-age-yes/g).length, 1);
  assert.equal(html.match(/<button[^>]*data-age-no/g).length, 1);
  assert.ok(html.includes(messages.AgeGate.title));
  assert.ok(html.includes(messages.AgeGate.yes));
  assert.match(html, /<img[^>]*width="160"[^>]*height="160"/);
  assert.ok(html.includes(`<script>${AGE_GATE_ACTIONS_SCRIPT}</script>`));
});
