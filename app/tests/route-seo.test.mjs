import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { runInThisContext } from "node:vm";
import ts from "typescript";

const src = fileURLToPath(new URL("../src/", import.meta.url));
const require = createRequire(import.meta.url);
const { NextRequest } = require("next/server");

const relation = (attributes) => ({ data: { attributes } });
const fixture = (category, type) => ({
  attributes: {
    category: relation({ name: category }),
    type: type ? relation({ slugType: type }) : { data: null },
    brand: relation({ name: "Test Brand", slug: "test-brand" }),
    compositeId: "123-test-product",
    name: "Test Product",
    previewImage: relation({ url: "https://images.example/product.png" })
  }
});

const load = (file, mocks = {}) => {
  const filename = resolve(src, file);
  const module = { exports: {} };
  const localRequire = (specifier) => {
    if (Object.hasOwn(mocks, specifier)) return mocks[specifier];
    if (specifier.startsWith("@/")) {
      return load(`${specifier.slice(2)}.ts`, mocks);
    }
    if (specifier.startsWith(".")) {
      return load(resolve(dirname(filename), `${specifier}.ts`), mocks);
    }
    return require(specifier);
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

const requests = (products) => ({
  getQuery: async ({ variables }) => ({
    data: {
      products: {
        data: products.filter(
          ({ attributes }) => attributes.compositeId === variables.compositeId
        )
      }
    }
  }),
  getClient: () => ({
    query: async () => ({ data: { products: { data: products } } })
  })
});

const loadProduct = (category, products) =>
  load(
    `app/[locale]/${category}/${["accessory", "coal"].includes(category) ? "[type]/" : ""}[brand]/[${category}Id]/page.tsx`,
    {
      "@/lib/server": requests(products),
      "@/componets/pages": {
        HookahProductPage: () => null,
        AccessoryProductPage: () => null,
        TobaccoProductPage: () => null
      },
      "@/componets/molecules": { Head: () => null },
      "@/utils/helpers": { getLocale: ({ locale }) => locale },
      "next-intl/server": { getTranslations: async () => (key) => key }
    }
  );

const args = (category, locale, id = "123-test-product") => ({
  params: {
    locale,
    type: "wrong-type",
    brand: "wrong-brand",
    [`${category}Id`]: id
  }
});

test("robots allows noindex routes and their queries while blocking other queries", () => {
  const {
    rules: [rules]
  } = load("app/robots.ts").default();
  const canCrawl = (path) => {
    const matches = (pattern) =>
      new RegExp(
        `^${pattern.replace(/[.?]/g, "\\$&").replaceAll("*", ".*")}`
      ).test(path);
    const longest = (patterns = []) =>
      Math.max(
        -1,
        ...patterns.filter(matches).map((pattern) => pattern.length)
      );
    return longest(rules.allow) >= longest(rules.disallow);
  };

  for (const locale of ["uk", "ru"]) {
    for (const route of ["cart", "cart/checkout", "search"]) {
      const path = `/${locale}/${route}`;
      assert.equal(canCrawl(path), true, path);
      for (const query of ["?seach=test&sort=price", "/?seach=test"]) {
        assert.equal(canCrawl(path + query), true, path + query);
      }
    }
    assert.equal(canCrawl(`/${locale}/search-other?sort=price`), false);
    assert.equal(canCrawl(`/${locale}/coal?sort=price`), false);
    assert.equal(canCrawl(`/${locale}/coal`), true);
  }
  for (const route of ["cart", "cart/checkout", "search"]) {
    const page = load(`app/[locale]/${route}/page.tsx`, {
      "@/componets/pages": {},
      "next-intl/server": {}
    });
    assert.equal(page.metadata.robots.index, false);
  }
  assert.equal(canCrawl("/404"), false);
  assert.equal(canCrawl("/500"), false);
});

for (const [category, type] of [
  ["accessory", "chasha"],
  ["coal", "kokosove"]
]) {
  test(`${category} metadata uses the product path emitted by the sitemap`, async (t) => {
    const base = "https://seo.example";
    const previousBase = process.env.NEXT_PUBLIC_BASE_URL;
    process.env.NEXT_PUBLIC_BASE_URL = base;
    t.after(() => {
      if (previousBase === undefined) delete process.env.NEXT_PUBLIC_BASE_URL;
      else process.env.NEXT_PUBLIC_BASE_URL = previousBase;
    });
    const products = [fixture(category, type)];
    const sitemap = await load("app/sitemapProducts.ts", {
      "@/lib/server": requests([...products, fixture(category, null)])
    }).default();
    assert.equal(sitemap.length, 2);
    const page = loadProduct(category, products);
    const path = `/${category}/${type}/test-brand/123-test-product`;
    for (const locale of ["uk", "ru"]) {
      const url = `${base}/${locale}${path}`;
      const metadata = await page.generateMetadata(args(category, locale));
      assert.equal(metadata.alternates.canonical, url);
      assert.deepEqual(metadata.alternates.languages, {
        uk: `${base}/uk${path}`,
        ru: `${base}/ru${path}`,
        "x-default": `${base}/uk${path}`
      });
      assert.equal(metadata.openGraph.url, url);
      assert.ok(sitemap.some((entry) => entry.url === url));

      if (category === "coal") {
        const layout = await page.default(args(category, locale));
        const { structuredData, breadcrumbsJsonLd } =
          layout.props.children[0].props;
        assert.equal(structuredData.offers.url, url);
        assert.equal(
          breadcrumbsJsonLd.itemListElement[2].item,
          `${base}/${locale}/coal/${type}`
        );
        assert.equal(
          breadcrumbsJsonLd.itemListElement[3].item,
          `${base}/${locale}/coal/${type}/test-brand`
        );
        assert.equal(breadcrumbsJsonLd.itemListElement[4].item, url);
      }
    }
  });

  test(`${category} rejects unavailable IDs and incomplete product paths`, async () => {
    const isNotFound = (error) => error.digest === "NEXT_NOT_FOUND";
    const product = fixture(category, type);
    const cases = [
      [[product], "unknown"],
      [[fixture("tobacco", null)], "123-test-product"],
      [[fixture(category, null)], "123-test-product"],
      [
        [{ attributes: { ...product.attributes, brand: { data: null } } }],
        "123-test-product"
      ]
    ];
    for (const [products, id] of cases) {
      const page = loadProduct(category, products);
      await assert.rejects(
        page.generateMetadata(args(category, "uk", id)),
        isNotFound
      );
      await assert.rejects(page.default(args(category, "uk", id)), isNotFound);
    }
  });
}

test("middleware handles locale routing without emitting hreflang Link headers", () => {
  const middleware = load("middleware.ts", {
    "@/utils/navigation": load("utils/navigation/index.ts")
  }).default;
  for (const path of [
    "/ru/search?seach=test",
    "/uk/coal/wrong-type/wrong-brand/123-test-product"
  ]) {
    const url = `https://store.example${path}`;
    const response = middleware(new NextRequest(url));
    assert.equal(response.headers.get("Link"), null);
    assert.equal(response.headers.get("x-middleware-rewrite"), url);
  }
});

for (const category of ["hookah", "tobacco"]) {
  test(`${category} only serves products from its own category`, async () => {
    const input = args(category, "uk");
    const valid = loadProduct(category, [fixture(category, null)]);
    const metadata = await valid.generateMetadata(input);
    assert.equal(
      new URL(metadata.alternates.canonical).pathname,
      `/uk/${category}/test-brand/123-test-product`
    );
    await valid.default(input);

    for (const products of [[], [fixture("coal", "kokosove")]]) {
      const page = loadProduct(category, products);
      for (const render of [page.default, page.generateMetadata]) {
        await assert.rejects(
          render(input),
          (error) => error.digest === "NEXT_NOT_FOUND"
        );
      }
    }
  });
}
