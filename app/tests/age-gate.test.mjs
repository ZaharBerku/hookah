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
const css = readFileSync(resolve(src, "app/globals.css"), "utf8");
const layout = readFileSync(resolve(src, "app/[locale]/layout.tsx"), "utf8");
const gateDir = resolve(src, "componets/organisms/AgeGate");

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
  },
  "./ClientInit": { AgeGateClientInit: () => null }
});

const {
  ADULT_ATTRIBUTE,
  AGE_GATE_ID,
  AGE_GATE_NOSCRIPT_STYLE,
  AGE_GATE_SCRIPT,
  LEAVE_URL
} = load(resolve(gateDir, "script.ts"));
const { AgeGate } = load(resolve(gateDir, "index.tsx"));

const GATE = `#${AGE_GATE_ID}`;
const ADULT = { [ADULT_ATTRIBUTE]: "" };

const setUp = ({ cookie = "", cookiesBlocked = false } = {}) => {
  const attributes = {};
  const observers = [];
  const listeners = { click: [], keydown: [] };
  const state = { cookie };
  const document = {
    activeElement: null,
    documentElement: {
      hasAttribute: (name) => name in attributes,
      setAttribute: (name, value) => (attributes[name] = value)
    },
    get cookie() {
      return state.cookie;
    },
    set cookie(value) {
      if (!cookiesBlocked) state.cookie = value;
    }
  };
  const buttons = ["no", "yes"].map((name) => ({
    name,
    focus() {
      document.activeElement = this;
    }
  }));
  const gate = {
    contains: (element) => buttons.includes(element),
    querySelectorAll: () => buttons
  };
  document.getElementById = (id) => (id === AGE_GATE_ID ? gate : null);
  const window = {
    location: { href: "about:blank" },
    addEventListener: (type, handler, capture) =>
      listeners[type].push({ handler, capture })
  };
  class MutationObserver {
    constructor(callback) {
      this.callback = callback;
    }
    observe(target, options) {
      observers.push({ callback: this.callback, target, options });
    }
  }
  const run = () =>
    new Function("window", "document", "MutationObserver", AGE_GATE_SCRIPT)(
      window,
      document,
      MutationObserver
    );
  run();
  const click = (...matching) =>
    listeners.click[0].handler({
      target: { closest: (selector) => matching.includes(selector) || null }
    });
  const tab = ({ from = null, shiftKey = false } = {}) => {
    document.activeElement = from;
    let prevented = false;
    listeners.keydown[0].handler({
      key: "Tab",
      shiftKey,
      preventDefault: () => (prevented = true)
    });
    return { prevented, focused: document.activeElement?.name };
  };
  const loseMark = () => {
    delete attributes[ADULT_ATTRIBUTE];
    observers[0].callback();
  };
  return {
    attributes,
    buttons,
    click,
    document,
    listeners,
    loseMark,
    observers,
    run,
    state,
    tab,
    window
  };
};

test("the script marks the document only for the is_adult=true cookie", () => {
  for (const cookie of ["is_adult=true", "a=1; is_adult=true; b=2"]) {
    assert.deepEqual(setUp({ cookie }).attributes, ADULT, cookie);
  }
  for (const cookie of [
    "",
    "is_adult=false",
    "xis_adult=true",
    "is_adult=truex",
    "a=is_adult=true"
  ]) {
    assert.deepEqual(setUp({ cookie }).attributes, {}, cookie);
  }
});

test("the mark is restored when the document element loses it", () => {
  const confirmed = setUp({ cookie: "is_adult=true" });
  assert.equal(confirmed.observers.length, 1);
  assert.equal(
    confirmed.observers[0].target,
    confirmed.document.documentElement
  );
  assert.deepEqual(confirmed.observers[0].options, {
    attributes: true,
    attributeFilter: [ADULT_ATTRIBUTE]
  });
  confirmed.loseMark();
  assert.deepEqual(confirmed.attributes, ADULT);

  const visitor = setUp();
  visitor.loseMark();
  assert.deepEqual(visitor.attributes, {});
});

test("yes stores the session cookie and reveals the page", () => {
  const { attributes, click, state, window } = setUp();
  click(GATE, "[data-age-yes]", "[role=dialog]");
  assert.equal(state.cookie, "is_adult=true; path=/");
  assert.deepEqual(attributes, ADULT);
  assert.equal(window.location.href, "about:blank");
});

test("with cookies blocked yes still holds for the life of the document", () => {
  const { attributes, click, loseMark, state } = setUp({
    cookiesBlocked: true
  });
  click(GATE, "[data-age-yes]", "[role=dialog]");
  assert.equal(state.cookie, "");
  assert.deepEqual(attributes, ADULT);
  loseMark();
  assert.deepEqual(attributes, ADULT);
});

test("no and a click outside the dialog leave the site", () => {
  for (const matching of [[GATE, "[data-age-no]", "[role=dialog]"], [GATE]]) {
    const { attributes, click, state, window } = setUp();
    click(...matching);
    assert.equal(window.location.href, LEAVE_URL);
    assert.equal(state.cookie, "");
    assert.deepEqual(attributes, {});
  }
});

test("clicks on the dialog body or outside the gate do nothing", () => {
  for (const matching of [[GATE, "[role=dialog]"], []]) {
    const { attributes, click, state, window } = setUp();
    click(...matching);
    assert.equal(window.location.href, "about:blank");
    assert.equal(state.cookie, "");
    assert.deepEqual(attributes, {});
  }
});

test("click and keydown are handled on window in the capture phase", () => {
  const { listeners } = setUp();
  for (const type of ["click", "keydown"]) {
    assert.equal(listeners[type].length, 1, type);
    assert.equal(listeners[type][0].capture, true, type);
  }
});

test("running the script again adds nothing", () => {
  const { attributes, listeners, observers, run } = setUp({
    cookie: "is_adult=true"
  });
  run();
  assert.equal(listeners.click.length, 1);
  assert.equal(listeners.keydown.length, 1);
  assert.equal(observers.length, 1);
  assert.deepEqual(attributes, ADULT);
});

test("Tab cycles between the gate buttons while the gate is open", () => {
  const { buttons, tab } = setUp();
  const [no, yes] = buttons;
  assert.deepEqual(tab(), { prevented: true, focused: "no" });
  assert.deepEqual(tab({ shiftKey: true }), {
    prevented: true,
    focused: "yes"
  });
  assert.deepEqual(tab({ from: yes }), { prevented: true, focused: "no" });
  assert.deepEqual(tab({ from: no, shiftKey: true }), {
    prevented: true,
    focused: "yes"
  });
  assert.deepEqual(tab({ from: no }), { prevented: false, focused: "no" });
  assert.deepEqual(tab({ from: yes, shiftKey: true }), {
    prevented: false,
    focused: "yes"
  });
});

test("Tab is left alone once the visitor is confirmed", () => {
  const { tab } = setUp({ cookie: "is_adult=true" });
  assert.deepEqual(tab(), { prevented: false, focused: undefined });
});

test("the gate markup starts with its script and holds a labelled dialog", async () => {
  const html = renderToStaticMarkup(await AgeGate({ locale: "uk" }));
  assert.ok(html.startsWith(`<script>${AGE_GATE_SCRIPT}</script>`));
  assert.ok(
    html.includes(`<noscript><style>${AGE_GATE_NOSCRIPT_STYLE}</style>`)
  );
  assert.ok(html.includes(`<div id="${AGE_GATE_ID}"`));
  assert.match(html, /role="dialog"/);
  assert.match(html, /aria-modal="true"/);
  assert.match(html, /aria-labelledby="age-gate-title"/);
  assert.equal(html.match(/<button[^>]*data-age-yes/g).length, 1);
  assert.equal(html.match(/<button[^>]*data-age-no/g).length, 1);
  assert.ok(html.includes(messages.AgeGate.title));
  assert.ok(html.includes(messages.AgeGate.yes));
  assert.match(html, /<img[^>]*width="160"[^>]*height="160"/);
});

test("a layout mounted in the browser starts the gate script", () => {
  const executed = [];
  const original = globalThis.document;
  globalThis.document = {
    createElement: (tag) => ({ tag, textContent: "" }),
    head: {
      appendChild: (node) => {
        executed.push(node);
        return { remove: () => executed.push("removed") };
      }
    }
  };
  try {
    const { AgeGateClientInit } = createLoader({
      react: { useLayoutEffect: (effect) => effect() }
    })(resolve(gateDir, "ClientInit.tsx"));
    assert.equal(AgeGateClientInit(), null);
  } finally {
    globalThis.document = original;
  }
  assert.deepEqual(executed, [
    { tag: "script", textContent: AGE_GATE_SCRIPT },
    "removed"
  ]);
});

test("the stylesheet hides the gate for confirmed visitors and locks only gated pages", () => {
  assert.match(
    css,
    /html\[data-adult\] #age-gate\s*\{\s*display:\s*none;\s*\}/
  );
  assert.match(
    css,
    /html:not\(\[data-adult\]\) body\[data-age-gate\]\s*\{\s*overflow:\s*hidden !important;/
  );
  assert.doesNotMatch(css, /html:not\(\[data-adult\]\) body\s*\{/);
  assert.ok(AGE_GATE_NOSCRIPT_STYLE.includes(`#${AGE_GATE_ID}{display:none}`));
  assert.ok(
    AGE_GATE_NOSCRIPT_STYLE.includes(
      `html:not([${ADULT_ATTRIBUTE}]) body[data-age-gate]{overflow:visible!important`
    )
  );
});

test("the layout marks its body as gated and renders the gate first", () => {
  assert.match(layout, /<body[^>]*data-age-gate[^>]*>\s*<AgeGate\b/);
});
