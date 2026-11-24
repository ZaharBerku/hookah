import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { runInThisContext } from "node:vm";
import ts from "typescript";

export const src = fileURLToPath(new URL("../../src/", import.meta.url));
export const appRequire = createRequire(
  new URL("../../package.json", import.meta.url)
);

const resolveFile = (base) =>
  [`${base}.ts`, `${base}.tsx`, `${base}/index.ts`, `${base}/index.tsx`].find(
    existsSync
  );

export const createLoader = (stubs) => {
  const modules = new Map();
  const load = (filename) => {
    if (modules.has(filename)) return modules.get(filename).exports;
    const module = { exports: {} };
    modules.set(filename, module);
    const localRequire = (specifier) => {
      if (specifier in stubs) return stubs[specifier];
      if (specifier.startsWith("@/")) {
        return load(resolveFile(resolve(src, specifier.slice(2))));
      }
      if (specifier.startsWith(".")) {
        return load(resolveFile(resolve(dirname(filename), specifier)));
      }
      return appRequire(specifier);
    };
    const { outputText } = ts.transpileModule(readFileSync(filename, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        jsx: ts.JsxEmit.ReactJSX,
        esModuleInterop: true
      }
    });
    runInThisContext(`(function(require,module,exports){${outputText}\n})`, {
      filename
    })(localRequire, module, module.exports);
    return module.exports;
  };
  return load;
};
