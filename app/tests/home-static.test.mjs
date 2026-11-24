import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

import { appRequire, createLoader, src } from "./support/load-tsx.mjs";

const appRoot = fileURLToPath(new URL("..", import.meta.url));

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

const stubModule = new Proxy(() => {}, {
  get: () => stubModule,
  apply: () => stubModule,
  construct: () => stubModule
});
const loadPage = createLoader(
  new Proxy({}, { has: () => true, get: () => stubModule })
);

test("every locale page except home renders per request", () => {
  assert.ok(localePages.includes(HOME_PAGE));
  assert.ok(localePages.length > 10);
  for (const page of localePages.filter((file) => file !== HOME_PAGE)) {
    assert.equal(
      loadPage(join(src, page)).dynamic,
      "force-dynamic",
      `${page} must export dynamic = "force-dynamic"`
    );
  }
});

test("home page is static with five minute revalidation and only known locales", async () => {
  const page = loadPage(join(src, HOME_PAGE));
  assert.equal(page.dynamic, "force-static");
  assert.equal(page.revalidate, 300);
  assert.equal(page.dynamicParams, false);
  assert.deepEqual(await page.generateStaticParams(), [
    { locale: "uk" },
    { locale: "ru" }
  ]);
});

test("build prerenders only the two home pages at five minutes", (t) => {
  const manifestPath = join(appRoot, ".next/prerender-manifest.json");
  if (
    !existsSync(join(appRoot, ".next/BUILD_ID")) ||
    !existsSync(manifestPath)
  ) {
    t.skip("no production build output");
    return;
  }
  const buildTime = statSync(join(appRoot, ".next/BUILD_ID")).mtimeMs;
  const sourceTime = Math.max(
    ...walk(src).map((path) => statSync(path).mtimeMs),
    statSync(join(appRoot, "next.config.mjs")).mtimeMs
  );
  if (sourceTime > buildTime) {
    t.skip("production build is older than the source");
    return;
  }
  const { routes, dynamicRoutes } = JSON.parse(
    readFileSync(manifestPath, "utf8")
  );
  const localeRoutes = Object.keys(routes).filter((route) =>
    /^\/(uk|ru)(\/|$)/.test(route)
  );
  assert.deepEqual(localeRoutes.sort(), ["/ru", "/uk"]);
  for (const route of localeRoutes) {
    assert.equal(routes[route].initialRevalidateSeconds, 300, route);
  }
  assert.deepEqual(
    Object.keys(dynamicRoutes).filter((route) => route.startsWith("/[locale]")),
    ["/[locale]"]
  );
  assert.equal(dynamicRoutes["/[locale]"].fallback, false);
});

test("request headers are only read by API helpers", () => {
  const readers = walk(src)
    .filter((path) => /\.(ts|tsx)$/.test(path))
    .filter((path) => /from "next\/headers"/.test(readFileSync(path, "utf8")))
    .map(rel);
  assert.deepEqual(readers, ["utils/helpers/getClientIp.ts"]);
});

test("server Strapi queries skip the Data Cache", async () => {
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

    assert.equal(calls.length, 2);
    for (const { init } of calls) {
      assert.equal(init.cache, "no-store");
      assert.equal(init.next, undefined);
    }
  } finally {
    globalThis.fetch = originalFetch;
  }
});

const React = appRequire("react");
const { renderToStaticMarkup } = appRequire("react-dom/server");
const attr = (tag, name) => tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];

const staticImage = (name) => {
  const file = readFileSync(join(src, "assets", name), "utf8");
  const svg = file.match(/<svg\b[^>]*>/)[0];
  return {
    file,
    svg,
    src: `/_next/static/media/${name}.0a1b2c3d.svg`,
    width: Number(attr(svg, "width")),
    height: Number(attr(svg, "height"))
  };
};
const wordmark = staticImage("logo-with-name.svg");
const icon = staticImage("logo.svg");
const load = createLoader({
  "@/assets/logo-with-name.svg?url": wordmark,
  "@/assets/logo.svg?url": icon,
  "@/utils/navigation": {
    Link: ({ children, href, className }) =>
      React.createElement("a", { href, className }, children)
  },
  "@/componets/atoms": {
    Icon: ({ type }) => React.createElement("svg", { "data-icon": type })
  }
});
const { DESKTOP_MEDIA, MOBILE_MEDIA, MOBILE_SIZES_MEDIA } = load(
  join(src, "utils/breakpoints.ts")
);
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
  assert.equal(attr(source, "media"), MOBILE_MEDIA);
  assert.equal(attr(mobile, "media"), MOBILE_MEDIA);
  assert.equal(attr(desktop, "media"), DESKTOP_MEDIA);
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

const checkStaticLogo = (img, { file, svg, width, height }) => {
  assert.equal(attr(svg, "width"), attr(img, "width"));
  assert.equal(attr(svg, "height"), attr(img, "height"));
  assert.equal(attr(svg, "viewBox"), `0 0 ${width} ${height}`);
  assert.ok(file.length < 100 * 1024);

  const classes = attr(img, "class").split(" ");
  for (const fixed of [`w-[${width}px]`, `h-[${height}px]`, "max-w-none"]) {
    assert.ok(classes.includes(fixed), `logo keeps ${fixed}`);
  }
};

test("footer wordmark is a lazy cacheable image, not inline markup", () => {
  const html = renderToStaticMarkup(React.createElement(Logo, {}));
  const img = html.match(/<img\b[^>]*>/)[0];
  assert.doesNotMatch(html, /<svg\b|<picture\b/);
  assert.match(img, /loading="lazy"/);
  assert.equal(attr(img, "src"), wordmark.src);
  assert.ok(attr(img, "alt"));
  checkStaticLogo(img, wordmark);
});

test("header logos load eagerly only at the viewport that shows them", () => {
  for (const [type, media, asset] of [
    ["LogoWithNameIcon", DESKTOP_MEDIA, wordmark],
    ["LogoIcon", MOBILE_MEDIA, icon]
  ]) {
    const html = renderToStaticMarkup(
      React.createElement(Logo, { type, media })
    );
    const source = html.match(/<source\b[^>]*>/)[0];
    const img = html.match(/<img\b[^>]*>/)[0];
    assert.doesNotMatch(html, /<svg\b/);
    assert.equal(attr(source, "media"), media);
    assert.equal(attr(source, "srcSet") ?? attr(source, "srcset"), asset.src);
    assert.match(img, /loading="eager"/);
    assert.ok(attr(img, "src").startsWith("data:"));
    assert.ok(attr(img, "alt"));
    checkStaticLogo(img, asset);
  }
});

test("inline logos stay inline", () => {
  const html = renderToStaticMarkup(
    React.createElement(Logo, { type: "LogoWithNameBlackIcon" })
  );
  assert.match(html, /data-icon="LogoWithNameBlackIcon"/);
  assert.doesNotMatch(html, /<img\b/);
});

const tailwindConfig = createLoader({
  "@nextui-org/theme": { nextui: () => ({}) }
})(join(appRoot, "tailwind.config.ts")).default;

test("shared media strings follow the Tailwind md breakpoint", () => {
  const md = tailwindConfig.theme.screens.md;
  assert.match(md, /^\d+px$/);
  assert.equal(DESKTOP_MEDIA, `(min-width: ${md})`);
  assert.equal(MOBILE_MEDIA, `not all and (min-width: ${md})`);
  assert.equal(MOBILE_SIZES_MEDIA, `(max-width: ${parseInt(md, 10) - 1}px)`);
});

test("header passes the shared media strings to its logos", () => {
  const RootHeader = createLoader({
    "@/componets/atoms": {
      Header: ({ children }) => React.createElement("header", null, children),
      Wrapper: ({ children }) => React.createElement("div", null, children)
    },
    "@/componets/molecules": {
      Banner: () => null,
      Catalog: () => null,
      MainSearch: () => null,
      ShoppingCart: () => null,
      Sidebar: () => null,
      SwitchLanguage: () => null,
      Logo: ({ type = "LogoWithNameIcon", media }) =>
        React.createElement("i", { "data-type": type, "data-media": media })
    }
  })(join(src, "componets/templates/RootHeader/index.tsx")).RootHeader;

  const html = renderToStaticMarkup(React.createElement(RootHeader));
  const mediaByType = Object.fromEntries(
    (html.match(/<i\b[^>]*>/g) ?? []).map((tag) => [
      attr(tag, "data-type"),
      attr(tag, "data-media")
    ])
  );
  assert.deepEqual(mediaByType, {
    LogoWithNameIcon: DESKTOP_MEDIA,
    LogoIcon: MOBILE_MEDIA
  });
});
