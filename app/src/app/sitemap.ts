import { GET_ALL_PRODUCTS_SITEMAP_QUERY } from "@/query/schema";
import { MetadataRoute } from "next";

import { getClient } from "@/lib/server";

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
  }
];

const types = [
  {
    category: "coal",
    type: "gorihove",
    brands: ["gresco"]
  },
  {
    category: "coal",
    type: "kokosove",
    brands: ["yahya", "gorilla", "escobar", "coaleco"]
  }
];

const typesWithBrand = [];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data } = await getClient().query({
    query: GET_ALL_PRODUCTS_SITEMAP_QUERY
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
          changeFrequency: "monthly"
        },
        {
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/ru/${category}/${currentSlug}/${slug}`,
          lastModified: new Date(),
          priority: 0.5,
          changeFrequency: "monthly"
        }
      ];
    })
    .flat();
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

  const sitemapTypes = types
    .map(({ category, type, brands }) => {
      return [
        {
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/ru/${category}/${type}`,
          lastModified: new Date(),
          priority: 0.5,
          changeFrequency: "monthly"
        },
        ...brands.map((brand) => ({
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/ru/${category}/${type}/${brand}`,
          lastModified: new Date(),
          priority: 0.5,
          changeFrequency: "monthly"
        }))
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
    ...sitemapBrands,
    ...sitemapProducts,
    ...sitemapTypes
  ];
}
