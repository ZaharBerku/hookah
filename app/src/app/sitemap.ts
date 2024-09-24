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
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/uk/hookah`,
      lastModified: new Date(),
      priority: 0.8,
      changeFrequency: "weekly"
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/ru/hookah`,
      lastModified: new Date(),
      priority: 0.8,
      changeFrequency: "weekly"
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/uk/tobacco`,
      lastModified: new Date(),
      priority: 0.8,
      changeFrequency: "weekly"
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/ru/tobacco`,
      lastModified: new Date(),
      priority: 0.8,
      changeFrequency: "weekly"
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/uk/coal`,
      lastModified: new Date(),
      priority: 0.8,
      changeFrequency: "weekly"
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/ru/coal`,
      lastModified: new Date(),
      priority: 0.8,
      changeFrequency: "weekly"
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/uk/accessory`,
      lastModified: new Date(),
      priority: 0.8,
      changeFrequency: "weekly"
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/ru/accessory`,
      lastModified: new Date(),
      priority: 0.8,
      changeFrequency: "weekly"
    },
    ...products,
    ...brands,
    ...types,
  ];
}
