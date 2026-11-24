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
