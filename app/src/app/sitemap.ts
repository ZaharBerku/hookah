import { GET_ALL_PRODUCTS_SITEMAP_QUERY } from "@/query/schema";
import { MetadataRoute } from "next";

import { getClient } from "@/lib/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data } = await getClient().query({
    query: GET_ALL_PRODUCTS_SITEMAP_QUERY
  });
  const {productsUk, productsRu } = data

  const sitemapProducts = productsUk.data
    .map((productUk: any, index: number) => {
      const categoryUk = productUk.attributes.category.data.attributes.name;
      const nameUk = productUk.attributes.name;
      const idUk = productUk.id;
      const categoryRu = productsRu.data[index].attributes.category.data.attributes.name
      const nameRu = productsRu.data[index].attributes.name;
      const idRu = productsRu.data[index].id
      return [
        {
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/uk/${categoryUk}/${nameUk}?productId=${idUk}`,
          lastModified: new Date(),
          priority: 0.5,
          changeFrequency: "monthly"
        },
        {
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/ru/${categoryRu}/${nameRu}?productId=${idRu}`,
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
