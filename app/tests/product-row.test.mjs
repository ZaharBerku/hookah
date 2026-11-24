import assert from "node:assert/strict";
import { resolve } from "node:path";
import { test } from "node:test";

import { appRequire, createLoader, src } from "./support/load-tsx.mjs";

const React = appRequire("react");
const { renderToStaticMarkup } = appRequire("react-dom/server");

const load = createLoader({
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
});

const { MOBILE_SIZES_MEDIA } = load(resolve(src, "utils/breakpoints.ts"));
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

const renderCards = (props) => {
  const html = renderToStaticMarkup(
    React.createElement(ProductRow, {
      data: [1, 2, 3, 4, 5, 6].map(makeCard),
      rowRef: { current: null },
      ...props
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

const SIZES = `${MOBILE_SIZES_MEDIA} 12.375rem, 18.4375rem`;
const escapeRegExp = (text) => text.replace(/[()]/g, "\\$&");

test("first four cards of a priority row put a visible lazy image in the initial markup", () => {
  const cards = renderCards({ priority: true });
  assert.equal(cards.length, 6);
  for (const { visible, noscript } of cards.slice(0, 4)) {
    assert.equal(visible.match(/<img\b/g)?.length, 1);
    assert.match(visible, /<img\b[^>]*\bloading="lazy"/);
    assert.match(visible, /<img\b[^>]*\bclass="[^"]*\bopacity-100\b/);
    assert.doesNotMatch(visible, /opacity-0|animate-spin/);
    assert.match(
      visible,
      new RegExp(`<img\\b[^>]*sizes="${escapeRegExp(SIZES)}"`)
    );
    assert.equal(noscript, "");
  }
});

test("later cards of a priority row defer the image and keep a noscript fallback", () => {
  const cards = renderCards({ priority: true });
  for (const { visible, noscript } of cards.slice(4)) {
    assert.doesNotMatch(visible, /<img\b/);
    assert.match(noscript, /<img\b[^>]*\bclass="[^"]*\bopacity-100\b/);
    assert.ok(noscript.includes(`sizes="${SIZES}"`));
  }
});

test("a row below the first defers every image and keeps a noscript fallback", () => {
  const cards = renderCards();
  assert.equal(cards.length, 6);
  for (const { visible, noscript } of cards) {
    assert.doesNotMatch(visible, /<img\b/);
    assert.match(noscript, /<img\b[^>]*\bclass="[^"]*\bopacity-100\b/);
    assert.ok(noscript.includes(`sizes="${SIZES}"`));
  }
});
