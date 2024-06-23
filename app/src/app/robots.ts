import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
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
