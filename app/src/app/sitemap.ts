"use server";

import { MetadataRoute } from "next";
import sitemapProducts from "./sitemapProducts";
import sitemapBrands from "./sitemapBrands";
import sitemapTypes from "./sitemapTypes";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await sitemapProducts();
  const brands = await sitemapBrands();
  const types = await sitemapTypes();

  return [
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/uk`,
      lastModified: new Date(),
      priority: 1,
      changeFrequency: "weekly",
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/ru`,
      lastModified: new Date(),
      priority: 1,
      changeFrequency: "weekly",
    },
    ...products,
    ...brands,
    ...types,
  ];
}
