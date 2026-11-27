import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const barrel = fileURLToPath(
  new URL("../public/icons/index.ts", import.meta.url)
);
const MAX_ICON_BYTES = 20 * 1024;

test("the icon barrel compiles only small SVGs into JS", () => {
  const imports = [
    ...readFileSync(barrel, "utf8").matchAll(/from "(\.\/[^"]+\.svg)"/g)
  ].map((match) => match[1]);
  assert.ok(imports.length > 0);
  for (const file of imports) {
    const { size } = statSync(resolve(dirname(barrel), file));
    assert.ok(size <= MAX_ICON_BYTES, `${file} is ${size} bytes`);
  }
});
