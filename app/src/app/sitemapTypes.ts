"use server";

import { MetadataRoute } from "next";

const types = [
  {
    category: "coal",
    type: "gorihove",
    brands: ["gresco"]
  },
  {
    category: "coal",
    type: "kokosove",
    brands: [
      "yahya",
      "gorilla",
      "escobar",
      "coaleco",
      "phoenix",
      "tom-coco-gold",
      "unity",
      "garden",
      "ignis"
    ]
  },
  {
    category: "accessory",
    type: "kalaudi",
    brands: ["yahya", "ocean-hookah", "kaloud", "mig"]
  },
  {
    category: "accessory",
    type: "kolbi",
    brands: ["yahya", "2x2-hookah", "gorilla"]
  },
  {
    category: "accessory",
    type: "shhipczi",
    brands: ["yahya", "gramm", "embery", "gorilla"]
  },
  {
    category: "accessory",
    type: "shlangi",
    brands: []
  },
  {
    category: "accessory",
    type: "chasha",
    brands: [
      "gorilla",
      "2x2-hookah",
      "solaris",
      "lavart",
      "embery",
      "karma",
      "gusto-bowls"
    ]
  },
  {
    category: "accessory",
    type: "personalni-mundshtuki",
    brands: ["yahya", "gusto-bowls", "lavart"]
  },
  {
    category: "accessory",
    type: "mundshtuki",
    brands: []
  }
];

export default async function sitemapTypes(): Promise<MetadataRoute.Sitemap> {
  const sitemapTypes = types
    .map(({ category, type, brands }) => [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/ru/${category}/${type}`,
        lastModified: new Date(),
        priority: 0.5,
        changeFrequency: "monthly"
      },
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/uk/${category}/${type}`,
        lastModified: new Date(),
        priority: 0.5,
        changeFrequency: "monthly"
      },
      ...brands
        .map((brand) => [
          {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/ru/${category}/${type}/${brand}`,
            lastModified: new Date(),
            priority: 0.5,
            changeFrequency: "monthly"
          },
          {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/uk/${category}/${type}/${brand}`,
            lastModified: new Date(),
            priority: 0.5,
            changeFrequency: "monthly"
          }
        ])
        .flat()
    ])
    .flat();

  return sitemapTypes as any;
}
