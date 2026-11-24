import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

import { appRequire, createLoader, src } from "./support/load-tsx.mjs";

const read = (file) => readFileSync(join(src, file), "utf8");
const publicDir = fileURLToPath(new URL("../public/", import.meta.url));

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
const rel = (path) => relative(src, path).split(sep).join("/");

const localePages = walk(join(src, "app/[locale]"))
  .filter((path) => path.endsWith(`${sep}page.tsx`))
  .map(rel);
const HOME_PAGE = "app/[locale]/page.tsx";

test("every locale page except home renders per request", () => {
  assert.ok(localePages.includes(HOME_PAGE));
  assert.ok(localePages.length > 10);
  for (const page of localePages.filter((file) => file !== HOME_PAGE)) {
    assert.match(
      read(page),
      /^export const dynamic = "force-dynamic";$/m,
      `${page} must export dynamic = "force-dynamic"`
    );
  }
});

test("home page is static with five minute revalidation and only known locales", () => {
  const page = read(HOME_PAGE);
  assert.match(page, /^export const revalidate = 300;$/m);
  assert.match(page, /^export const dynamicParams = false;$/m);
  assert.doesNotMatch(page, /force-dynamic|headers\(|cookies\(|searchParams/);
});

test("request headers are only read by API helpers", () => {
  const readers = walk(src)
    .filter((path) => /\.(ts|tsx)$/.test(path))
    .filter((path) => /from "next\/headers"/.test(readFileSync(path, "utf8")))
    .map(rel);
  assert.deepEqual(readers, ["utils/helpers/getClientIp.ts"]);
});

test("server Strapi queries skip the Data Cache unless a query opts in", async () => {
  const calls = [];
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url, init) => {
    calls.push({ url, init });
    return new Response(JSON.stringify({ data: { ping: "pong" } }), {
      status: 200,
      headers: { "content-type": "application/json" }
    });
  };
  try {
    const { gql } = appRequire("@apollo/client");
    const load = createLoader({
      "@apollo/experimental-nextjs-app-support/rsc": {
        registerApolloClient: (makeClient) => ({ getClient: makeClient })
      },
      "@/utils/helpers": { getLocale: () => "uk" }
    });
    const { getQuery, getClient } = load(join(src, "lib/server.tsx"));
    const query = gql`
      query Ping($locale: I18NLocaleCode) {
        ping(locale: $locale)
      }
    `;

    await getQuery({ params: {}, query });
    await getClient().query({
      query: gql`
        {
          ping
        }
      `
    });
    await getQuery({ params: {}, query, revalidate: 300 });

    assert.equal(calls.length, 3);
    for (const { init } of calls.slice(0, 2)) {
      assert.equal(init.cache, "no-store");
      assert.equal(init.next, undefined);
    }
    assert.equal(calls[2].init.cache, undefined);
    assert.deepEqual(calls[2].init.next, { revalidate: 300 });
  } finally {
    globalThis.fetch = originalFetch;
  }
});

const React = appRequire("react");
const { renderToStaticMarkup } = appRequire("react-dom/server");
const load = createLoader({
  "@/utils/navigation": {
    Link: ({ children, href, className }) =>
      React.createElement("a", { href, className }, children)
  },
  "@/componets/atoms": {
    Icon: ({ type }) => React.createElement("svg", { "data-icon": type })
  }
});
const HeroSlide = load(
  join(src, "componets/organisms/MainSlider/HeroSlide.tsx")
).default;
const { Logo } = load(join(src, "componets/molecules/Logo/index.tsx"));

const heroProps = {
  href: "/tobacco/unity",
  desktopSrc: "/images/slide-1.webp",
  mobileSrc: "/images/slide-mobile-1.webp",
  alt: "Hero"
};
const attr = (tag, name) => tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];

test("priority hero preloads exactly the file its picture resolves to", () => {
  const html = renderToStaticMarkup(
    React.createElement(HeroSlide, { ...heroProps, priority: true })
  );
  const links = html.match(/<link\b[^>]*>/g);
  const source = html.match(/<source\b[^>]*>/)[0];
  const img = html.match(/<img\b[^>]*>/)[0];
  assert.equal(links.length, 2);

  const mobile = links.find((tag) => attr(tag, "href") === heroProps.mobileSrc);
  const desktop = links.find(
    (tag) => attr(tag, "href") === heroProps.desktopSrc
  );
  assert.equal(attr(mobile, "media"), attr(source, "media"));
  assert.equal(attr(desktop, "media"), `not all and ${attr(source, "media")}`);
  assert.equal(
    attr(source, "srcSet") ?? attr(source, "srcset"),
    heroProps.mobileSrc
  );
  assert.equal(attr(img, "src"), heroProps.desktopSrc);
  for (const tag of links) {
    assert.equal(attr(tag, "rel"), "preload");
    assert.equal(attr(tag, "as"), "image");
    assert.match(tag, /fetchPriority="high"/i);
  }
  assert.match(img, /loading="eager"/);
});

test("non priority hero stays lazy without preloads", () => {
  const html = renderToStaticMarkup(React.createElement(HeroSlide, heroProps));
  assert.doesNotMatch(html, /<link\b/);
  assert.match(html, /loading="lazy"/);
});

test("header wordmark is a lazy cacheable image, not inline markup", () => {
  const html = renderToStaticMarkup(React.createElement(Logo, {}));
  const img = html.match(/<img\b[^>]*>/)[0];
  assert.doesNotMatch(html, /<svg\b/);
  assert.match(img, /loading="lazy"/);
  assert.ok(attr(img, "alt"));

  const file = readFileSync(join(publicDir, attr(img, "src").slice(1)), "utf8");
  const svg = file.match(/<svg\b[^>]*>/)[0];
  assert.equal(attr(svg, "width"), attr(img, "width"));
  assert.equal(attr(svg, "height"), attr(img, "height"));
  assert.ok(file.length < 100 * 1024);
});

test("icon logos stay inline", () => {
  const html = renderToStaticMarkup(
    React.createElement(Logo, { type: "LogoIcon" })
  );
  assert.match(html, /data-icon="LogoIcon"/);
  assert.doesNotMatch(html, /<img\b/);
});
