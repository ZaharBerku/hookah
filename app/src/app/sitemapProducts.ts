"use server";

import { GET_ALL_PRODUCTS_SITEMAP_QUERY } from "@/query/schema";
import { MetadataRoute } from "next";

import { getClient } from "@/lib/server";
import { buildAlternates } from "@/utils/seo/alternates";
import { getProductPath } from "@/utils/seo/productPath";

export default async function sitemapProducts(): Promise<MetadataRoute.Sitemap> {
  const { data } = await getClient().query({
    query: GET_ALL_PRODUCTS_SITEMAP_QUERY
  });
  const { products } = data;

  return products.data.flatMap(({ attributes }: any) => {
    const path = getProductPath(attributes);
    if (!path) return [];

    const { languages } = buildAlternates("uk", path.join("/"));
    return [languages.uk, languages.ru].map((url) => ({
      url,
      lastModified: new Date(),
      priority: 0.5,
      changeFrequency: "monthly"
    }));
  });
}
