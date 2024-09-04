"use server";

import { MetadataRoute } from "next";
import { GET_ALL_PRODUCTS_SITEMAP_QUERY } from "@/query/schema";
import { getClient } from "@/lib/server";

export default async function sitemapProducts(): Promise<MetadataRoute.Sitemap> {
  const { data } = await getClient().query({
    query: GET_ALL_PRODUCTS_SITEMAP_QUERY,
  });
  const { products } = data;

  const sitemapProducts = products.data
    .map((product: any) => {
      const category = product.attributes.category.data.attributes.name;
      const slug = product.attributes.compositeId;
      const slugBrand = product.attributes.brand.data.attributes.slug;
      const slugType = product.attributes?.type?.data?.attributes?.slugType;
      const currentSlug = slugType
        ? `${slugType}/${slugBrand}`
        : `${slugBrand}`;
      return [
        {
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/uk/${category}/${currentSlug}/${slug}`,
          lastModified: new Date(),
          priority: 0.5,
          changeFrequency: "monthly",
        },
        {
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/ru/${category}/${currentSlug}/${slug}`,
          lastModified: new Date(),
          priority: 0.5,
          changeFrequency: "monthly",
        },
      ];
    })
    .flat();

  return sitemapProducts;
}
