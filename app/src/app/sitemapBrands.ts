"use server";

import { MetadataRoute } from "next";

const brands = [
  {
    category: "tobacco",
    brand: "420"
  },
  {
    category: "tobacco",
    brand: "absolem"
  },
  {
    category: "tobacco",
    brand: "flow"
  },
  {
    category: "tobacco",
    brand: "indigo"
  },
  {
    category: "tobacco",
    brand: "swipe"
  },
  {
    category: "tobacco",
    brand: "white-smok"
  },
  {
    category: "tobacco",
    brand: "unity"
  },
  {
    category: "tobacco",
    brand: "yummy"
  },
  {
    category: "hookah",
    brand: "yahya"
  },
  {
    category: "hookah",
    brand: "gramm"
  },
  {
    category: "hookah",
    brand: "gipsy"
  },
  {
    category: "hookah",
    brand: "t-hookah"
  }
];

export default async function sitemapBrands(): Promise<MetadataRoute.Sitemap> {
  const sitemapBrands = brands
    .map(({ category, brand }) => [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/uk/${category}/${brand}`,
        lastModified: new Date(),
        priority: 0.5,
        changeFrequency: "monthly"
      },
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/ru/${category}/${brand}`,
        lastModified: new Date(),
        priority: 0.5,
        changeFrequency: "monthly"
      }
    ])
    .flat();

  return sitemapBrands as any;
}
