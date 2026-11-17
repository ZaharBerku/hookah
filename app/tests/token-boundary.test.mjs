import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { test } from "node:test";

const appRoot = new URL("..", import.meta.url).pathname;
const srcRoot = join(appRoot, "src");
const SENTINEL = "HOOKAH_TOKEN_SENTINEL_DO_NOT_SHIP";

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });

const sourceFiles = walk(srcRoot).filter((path) => /\.(ts|tsx)$/.test(path));
const read = (path) => readFileSync(path, "utf8");
const isClientModule = (code) => /^\s*["']use client["']/.test(code);

test("next.config does not inline private env vars into bundles", () => {
  const config = read(join(appRoot, "next.config.mjs"));
  assert.doesNotMatch(config, /\benv\s*:\s*\{/);
  assert.doesNotMatch(config, /API_TOKEN/);
});

test("private token is read only in server-side modules", () => {
  const readers = sourceFiles
    .filter((path) => read(path).includes("process.env.API_TOKEN"))
    .map((path) => relative(srcRoot, path))
    .sort();
  assert.deepEqual(readers, [
    "app/api/graphql/route.ts",
    "lib/client.tsx",
    "lib/server.tsx"
  ]);
});

test("browser Apollo link targets the allowlisted proxy without auth", () => {
  const client = read(join(srcRoot, "lib/client.tsx"));
  assert.match(
    client,
    /typeof window === "undefined"\s*\?\s*makeServerLink\(\)\s*:\s*new HttpLink\(\{ uri: PUBLIC_GRAPHQL_PATH \}\)/
  );
});

test("lib/server is not a server-action module and is not imported by client code", () => {
  assert.doesNotMatch(
    read(join(srcRoot, "lib/server.tsx")),
    /["']use server["']/
  );
  const clientImporters = sourceFiles
    .filter((path) => path.includes("/stores/") || isClientModule(read(path)))
    .filter((path) => /from ["']@\/lib\/server["']/.test(read(path)))
    .map((path) => relative(srcRoot, path));
  assert.deepEqual(clientImporters, []);
});

test("built client chunks do not contain the synthetic token sentinel", (t) => {
  const staticDir = join(appRoot, ".next/static");
  if (process.env.API_TOKEN !== SENTINEL || !existsSync(staticDir)) {
    t.skip(
      `run: API_TOKEN=${SENTINEL} next build && API_TOKEN=${SENTINEL} yarn test`
    );
    return;
  }
  const leaking = walk(staticDir)
    .filter((path) => path.endsWith(".js"))
    .filter((path) => read(path).includes(SENTINEL))
    .map((path) => relative(appRoot, path));
  assert.deepEqual(leaking, []);
});
