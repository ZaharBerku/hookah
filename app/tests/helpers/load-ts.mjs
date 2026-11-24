import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { runInThisContext } from "node:vm";
import ts from "typescript";

export const src = fileURLToPath(new URL("../../src/", import.meta.url));
const modules = new Map();
export const mocks = new Map();

export const load = (filename) => {
  if (modules.has(filename)) return modules.get(filename).exports;
  const module = { exports: {} };
  modules.set(filename, module);
  const require = createRequire(filename);
  const localRequire = (specifier) => {
    if (mocks.has(specifier)) return mocks.get(specifier);
    if (specifier.startsWith("@/")) {
      return load(resolve(src, `${specifier.slice(2)}.ts`));
    }
    if (specifier.startsWith(".")) {
      return load(resolve(dirname(filename), `${specifier}.ts`));
    }
    return require(specifier);
  };
  const { outputText } = ts.transpileModule(readFileSync(filename, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020
    }
  });
  runInThisContext(`(function(require,module,exports){${outputText}\n})`, {
    filename
  })(localRequire, module, module.exports);
  return module.exports;
};
