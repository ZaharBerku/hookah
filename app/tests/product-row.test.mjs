import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const read = (path) =>
  readFileSync(fileURLToPath(new URL(`../${path}`, import.meta.url)), "utf8");

test("the first product cards render their image in the initial markup", () => {
  const row = read("src/componets/organisms/ProductRow/index.tsx");
  assert.match(row, /INITIAL_IMAGE_COUNT = 4/);
  assert.match(row, /index < INITIAL_IMAGE_COUNT/);
});

test("product card images pass sizes to every Image", () => {
  const header = read("src/componets/organisms/Card/CardHeader.tsx");
  const images = header.match(/<Image\b[^>]*>/gs) ?? [];
  assert.equal(images.length, 2);
  for (const image of images) assert.match(image, /sizes=\{CARD_IMAGE_SIZES\}/);
});
