import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        disallow: [
          "/404",
          "/500",
          "/ru/search",
          "/uk/search",
          "/ru/cart",
          "/uk/cart",
          "/ru/cart/checkout",
          "/uk/cart/checkout",
          "/*?",
        ]
      }
    ],
    sitemap: `${process.env.NEXT_PUBLIC_BASE_URL}/sitemap.xml`
  };
}
