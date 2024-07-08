import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/uk",
          "/ru",
          "/uk/tobacco/",
          "/uk/tobacco$",
          "/ru/tobacco/",
          "/ru/tobacco$",
          "/uk/hookah/",
          "/uk/hookah$",
          "/ru/hookah/",
          "/ru/hookah$",
          "/sitemap.xml"
        ],
        disallow: [
          "/",
          "404",
          "500",
          "/ru/search",
          "/uk/search",
          "/ru/cart",
          "/uk/cart",
          "/ru/cart/checkout",
          "/uk/cart/checkout",
          "/*?brands=",
          "/*?search="
        ]
      }
    ],
    sitemap: `${process.env.NEXT_PUBLIC_BASE_URL}/sitemap.xml`
  };
}
