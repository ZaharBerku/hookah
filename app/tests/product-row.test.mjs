import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { runInThisContext } from "node:vm";
import ts from "typescript";

const src = fileURLToPath(new URL("../src/", import.meta.url));
const appRequire = createRequire(new URL("../package.json", import.meta.url));
const React = appRequire("react");
const { renderToStaticMarkup } = appRequire("react-dom/server");

const stubs = {
  "@/utils/navigation": {
    Link: ({ children, href }) => React.createElement("a", { href }, children)
  },
  "@/utils/helpers": { saveScrollTarget: () => {} },
  "@/componets/atoms": {
    Icon: ({ className }) => React.createElement("svg", { className }),
    Typography: ({ text }) => React.createElement("h5", null, text),
    get Image() {
      return load(resolve(src, "componets/atoms/Image/index.tsx")).Image;
    }
  },
  "@/componets/molecules": {
    Price: () => null,
    Liker: () => null,
    BuyButton: () => null
  }
};

const resolveFile = (base) =>
  [`${base}.ts`, `${base}.tsx`, `${base}/index.ts`, `${base}/index.tsx`].find(
    existsSync
  );

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

const { ProductRow } = load(
  resolve(src, "componets/organisms/ProductRow/index.tsx")
);

const makeCard = (id) => ({
  id,
  attributes: {
    name: `Product ${id}`,
    price: 100,
    discount: 0,
    colors: [],
    compositeId: `c${id}`,
    numberOf: 1,
    odId: `o${id}`,
    likes: 0,
    category: { data: { attributes: { name: "hookah" } } },
    brand: { data: { attributes: { slug: "brand" } } },
    previewImage: {
      data: {
        attributes: {
          url: `https://cdn.test/${id}.jpg`,
          alternativeText: `Alt ${id}`,
          formats: {
            thumbnail: {
              origin: { url: `https://cdn.test/${id}-t.jpg`, width: 100 }
            },
            small: {
              origin: { url: `https://cdn.test/${id}-s.jpg`, width: 300 }
            }
          }
        }
      }
    }
  }
});

const renderCards = () => {
  const html = renderToStaticMarkup(
    React.createElement(ProductRow, {
      data: [1, 2, 3, 4, 5, 6].map(makeCard),
      rowRef: { current: null }
    })
  );
  return html
    .split("<article")
    .slice(1)
    .map((card) => ({
      visible: card.replace(/<noscript>.*?<\/noscript>/gs, ""),
      noscript: card.match(/<noscript>(.*?)<\/noscript>/s)?.[1] ?? ""
    }));
};

const SIZES = "(max-width: 767px) 12.375rem, 18.4375rem";

test("first four cards put a visible lazy image in the initial markup", () => {
  const cards = renderCards();
  assert.equal(cards.length, 6);
  for (const { visible, noscript } of cards.slice(0, 4)) {
    assert.equal(visible.match(/<img\b/g)?.length, 1);
    assert.match(visible, /<img\b[^>]*\bloading="lazy"/);
    assert.match(visible, /<img\b[^>]*\bclass="[^"]*\bopacity-100\b/);
    assert.doesNotMatch(visible, /opacity-0|animate-spin/);
    assert.match(
      visible,
      new RegExp(`<img\\b[^>]*sizes="${SIZES.replace(/[()]/g, "\\$&")}"`)
    );
    assert.equal(noscript, "");
  }
});

test("later cards defer the image and keep a noscript fallback", () => {
  const cards = renderCards();
  for (const { visible, noscript } of cards.slice(4)) {
    assert.doesNotMatch(visible, /<img\b/);
    assert.match(noscript, /<img\b[^>]*\bclass="[^"]*\bopacity-100\b/);
    assert.ok(noscript.includes(`sizes="${SIZES}"`));
  }
});
