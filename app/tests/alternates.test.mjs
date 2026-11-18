import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { beforeEach, test } from "node:test";
import { fileURLToPath } from "node:url";
import { runInThisContext } from "node:vm";
import ts from "typescript";

const src = fileURLToPath(new URL("../src/", import.meta.url));
const modules = new Map();
const load = (filename) => {
  if (modules.has(filename)) return modules.get(filename).exports;
  const module = { exports: {} };
  modules.set(filename, module);
  const require = createRequire(filename);
  const localRequire = (specifier) => {
    if (specifier.startsWith("@/")) {
      return load(resolve(src, `${specifier.slice(2)}.ts`));
    }
    if (specifier.startsWith(".")) {
      return load(resolve(dirname(filename), `${specifier}.ts`));
    }
    return require(specifier);
  };
  const { outputText } = ts.transpileModule(readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS }
  });
  runInThisContext(`(function(require,module,exports){${outputText}\n})`, {
    filename
  })(localRequire, module, module.exports);
  return module.exports;
};

const { buildAlternates } = load(resolve(src, "utils/seo/alternates.ts"));
const BASE = "https://hookahstore.com.ua";

beforeEach((t) => {
  const previousBase = process.env.NEXT_PUBLIC_BASE_URL;
  t.after(() => {
    if (previousBase === undefined) delete process.env.NEXT_PUBLIC_BASE_URL;
    else process.env.NEXT_PUBLIC_BASE_URL = previousBase;
  });
  delete process.env.NEXT_PUBLIC_BASE_URL;
});

test("home page canonical points at the locale home", () => {
  assert.deepEqual(buildAlternates("uk", ""), {
    canonical: `${BASE}/uk`,
    languages: {
      uk: `${BASE}/uk`,
      ru: `${BASE}/ru`,
      "x-default": `${BASE}/uk`
    }
  });
});

test("nested paths keep the path and swap only the locale", () => {
  const result = buildAlternates("ru", "tobacco/molfar/509-tyutyun");
  assert.equal(result.canonical, `${BASE}/ru/tobacco/molfar/509-tyutyun`);
  assert.equal(result.languages.uk, `${BASE}/uk/tobacco/molfar/509-tyutyun`);
  assert.equal(
    result.languages["x-default"],
    `${BASE}/uk/tobacco/molfar/509-tyutyun`
  );
});

test("unknown locale and stray slashes fall back to uk without doubling", () => {
  const result = buildAlternates("de", "/hookah/");
  assert.equal(result.canonical, `${BASE}/uk/hookah`);
  assert.equal(result.languages.ru, `${BASE}/ru/hookah`);
});

test("NEXT_PUBLIC_BASE_URL overrides the default host", () => {
  process.env.NEXT_PUBLIC_BASE_URL = "https://preview.test/";
  assert.equal(
    buildAlternates("uk", "coal").canonical,
    "https://preview.test/uk/coal"
  );
});
