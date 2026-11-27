import assert from "node:assert/strict";
import { statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { test } from "node:test";

import { createLoader, src } from "./support/load-tsx.mjs";

const layoutPath = resolve(src, "app/[locale]/layout.tsx");
const fontPath = resolve(src, "assets/fonts/inter-hryvnia.woff2");
const HRYVNIA_RANGE = { prop: "unicode-range", value: "U+20B4" };

const stubModule = new Proxy(() => {}, {
  get: () => stubModule,
  apply: () => stubModule,
  construct: () => stubModule
});
const googleFonts = [];
const localFonts = [];
const record = (calls) => (options) => {
  calls.push(options);
  return { variable: "font-variable" };
};
const fontModules = {
  "next/font/google": { Inter: record(googleFonts) },
  "next/font/local": { __esModule: true, default: record(localFonts) }
};
createLoader(
  new Proxy(
    {},
    { has: () => true, get: (_, id) => fontModules[id] ?? stubModule }
  )
)(layoutPath);

test("Inter preloads the cyrillic and latin subsets", () => {
  assert.equal(googleFonts.length, 1);
  assert.deepEqual(googleFonts[0].subsets, ["cyrillic", "latin"]);
});

test("the hryvnia sign has its own font file that covers nothing else", () => {
  assert.equal(localFonts.length, 1);
  const [font] = localFonts;
  assert.equal(resolve(dirname(layoutPath), font.src), fontPath);
  assert.ok(statSync(fontPath).size <= 4 * 1024);
  assert.deepEqual(font.declarations, [HRYVNIA_RANGE]);
  assert.equal(font.adjustFontFallback, false);
  assert.equal(font.weight, "100 900");
});
