import assert from "node:assert/strict";
import { statSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

const images = join(new URL("..", import.meta.url).pathname, "public/images");
const KB = 1024;
const size = (name) => statSync(join(images, name)).size;

test("desktop hero slides stay under 120 KB", () => {
  for (const name of ["slide-1.webp", "slide-2.webp", "slide-3.webp"]) {
    assert.ok(size(name) <= 120 * KB, `${name} is ${size(name)} bytes`);
  }
});

test("mobile hero slides exist and stay under 40 KB", () => {
  for (const name of [
    "slide-mobile-1.webp",
    "slide-2-mobile.webp",
    "slide-3-mobile.webp"
  ]) {
    assert.ok(size(name) <= 40 * KB, `${name} is ${size(name)} bytes`);
  }
});
