import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const src = fileURLToPath(new URL("../src/", import.meta.url));
const read = (file) => readFileSync(`${src}${file}`, "utf8");

test("home page renders statically with five minute revalidation", () => {
  const page = read("app/[locale]/page.tsx");
  assert.match(page, /export const revalidate = 300;/);
  assert.match(page, /unstable_setRequestLocale\(locale\)/);
  assert.doesNotMatch(page, /getIsMobile|headers\(|cookies\(|searchParams/);
});

test("locale layout tree does not read request headers", () => {
  for (const file of [
    "app/[locale]/layout.tsx",
    "componets/templates/RootHeader/index.tsx",
    "componets/pages/HomePage.tsx",
    "componets/organisms/MainSlider/index.tsx",
    "componets/organisms/MainSlider/FirstSlide.tsx"
  ]) {
    assert.doesNotMatch(read(file), /getIsMobile|isMobile|next\/headers/, file);
  }
});

test("first hero slide picks its image with a media query and loads eagerly", () => {
  const first = read("componets/organisms/MainSlider/FirstSlide.tsx");
  assert.match(first, /slide-1\.webp/);
  assert.match(first, /slide-mobile-1\.webp/);
  assert.match(first, /\bpriority\b/);

  const hero = read("componets/organisms/MainSlider/HeroSlide.tsx");
  assert.match(hero, /<source media="\(max-width: 768px\)"/);
  assert.match(hero, /loading=\{priority \? "eager" : "lazy"\}/);
  assert.match(hero, /fetchPriority=\{priority \? "high" : undefined\}/);
});

test("routes that render per request stay dynamic", () => {
  for (const route of [
    "accessory",
    "coal",
    "hookah",
    "tobacco",
    "discount-products",
    "new-products",
    "top-products"
  ]) {
    assert.match(
      read(`app/[locale]/${route}/page.tsx`),
      /export const dynamic = "force-dynamic";/,
      route
    );
  }
});
