import { print } from "graphql";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { test } from "node:test";
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

const { isAllowedGraphqlRequest } = load(
  resolve(src, "lib/graphqlAllowlist.ts")
);
const { CREATE_ORDER_MUTATION } = load(resolve(src, "query/order.ts"));
const query = print(CREATE_ORDER_MUTATION);
const allows = (item) =>
  isAllowedGraphqlRequest(query, { data: { order: [item] } });

test("orders accept products whose optional odId is null or absent", () => {
  assert.equal(allows({ id: "1", odId: null, quantity: 1 }), true);
  assert.equal(allows({ id: "1", quantity: 1 }), true);
});

test("orders retain integer odId support and reject malformed values", () => {
  for (const odId of [169, "169"]) {
    assert.equal(allows({ odId, quantity: 1 }), true);
  }
  for (const odId of ["invalid", 1.5, {}, [], true]) {
    assert.equal(allows({ odId, quantity: 1 }), false);
  }
});

test("optional odId does not bypass quantity or field restrictions", () => {
  for (const quantity of [0, -1, 1.5, "1", null]) {
    assert.equal(allows({ odId: null, quantity }), false);
  }
  assert.equal(allows({ quantity: 1, status: "paid" }), false);
  assert.equal(allows(null), false);
});
