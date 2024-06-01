import { GET_ALL_PRODUCTS_SITEMAP_QUERY } from "@/query/schema";
import { MetadataRoute } from "next";

import { getClient } from "@/lib/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data } = await getClient().query({
    query: GET_ALL_PRODUCTS_SITEMAP_QUERY
  });

  const sitemapProducts = data.products.data
    .map((product: any) => {
      const { attributes, id } = product;
      const caterory = attributes.category.data.attributes.name;
      return [
        {
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/uk/${caterory}/${attributes.name}?productId=${id}`,
          lastModified: new Date(),
          priority: 0.5,
          changeFrequency: "monthly"
        },
        {
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/ru/${caterory}/${attributes.name}?productId=${id}`,
          lastModified: new Date(),
          priority: 0.5,
          changeFrequency: "monthly"
        }
      ];
    })
    .flat();

  return [
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/uk`,
      lastModified: new Date(),
      priority: 1,
      changeFrequency: "weekly"
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/ru`,
      lastModified: new Date(),
      priority: 1,
      changeFrequency: "weekly"
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
    ...sitemapProducts
  ];
}
