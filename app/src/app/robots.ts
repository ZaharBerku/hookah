import { MetadataRoute } from "next";

const noindexPaths = ["cart", "cart/checkout", "search"];
const queryExceptions = ["uk", "ru"].flatMap((locale) =>
  noindexPaths.flatMap((path) => [
    `/${locale}/${path}?`,
    `/${locale}/${path}/?`
  ])
);

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: queryExceptions,
        disallow: ["/404", "/500", "/*?"]
      }
    ],
    sitemap: `${process.env.NEXT_PUBLIC_BASE_URL}/sitemap.xml`
  };
}
