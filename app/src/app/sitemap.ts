import { GET_ALL_PRODUCTS_SITEMAP_QUERY } from "@/query/schema";
import { MetadataRoute } from "next";

import { getClient } from "@/lib/server";

const brands = ["420", "absolem", "flow", "indigo", "swipe", "white-smok"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data } = await getClient().query({
    query: GET_ALL_PRODUCTS_SITEMAP_QUERY
  });
  const { products } = data;

  const sitemapProducts = products.data
    .map((product: any) => {
      const category = product.attributes.category.data.attributes.name;
      const slug = product.attributes.compositeId;
      const slugBrand =  product.attributes.brand.data.attributes.slug;
      return [
        {
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/uk/${category}/${slugBrand}/${slug}`,
          lastModified: new Date(),
          priority: 0.5,
          changeFrequency: "monthly"
        },
        {
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/ru/${category}/${slugBrand}/${slug}`,
          lastModified: new Date(),
          priority: 0.5,
          changeFrequency: "monthly"
        }
      ];
    })
    .flat();
  const sitemapBrands = brands
    .map((brand) => [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/uk/tobacco/${brand}`,
        lastModified: new Date(),
        priority: 0.5,
        changeFrequency: "monthly"
      },
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/ru/tobacco/${brand}`,
        lastModified: new Date(),
        priority: 0.5,
        changeFrequency: "monthly"
      }
    ])
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
    ...sitemapBrands,
    ...sitemapProducts
  ];
}
