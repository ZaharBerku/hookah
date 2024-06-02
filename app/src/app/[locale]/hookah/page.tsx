import { ProductsPage } from "@/compoents/pages";
import { GET_CATEGORY_PRODUCTS_QUERY } from "@/query/schema";
import { notFound } from "next/navigation";

import { getClient } from "@/lib/server";
import { locales } from "@/utils/navigation";

export default async function Hookah() {
  const { loading, error, data } = await getClient().query({
    query: GET_CATEGORY_PRODUCTS_QUERY,
    variables: {
      category: "hookah"
    }
  });

  if (error) notFound();

  return (
    <ProductsPage
      data={data.products.data}
      loading={loading}
      label={"Кальяни"}
      brands={data.brands.data}
    />
  );
}

export async function generateMetadata({
  params
}: {
  params: { locale: "uk" | "ru" };
}) {
  const locale = locales.includes(params.locale) ? params.locale : "uk";
  const { Hookah } = await import(`../../../../messages/${locale}.json`);
  return {
    metadataBase: `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}`,
    title: Hookah.title,
    description: Hookah.description,
    openGraph: {
      title: Hookah.ogTitle,
      description: Hookah.ogDescription,
      images: [
        {
          url: "https://strapi-hookah-images.s3.us-east-1.amazonaws.com/logo_b8a1bc1da6.png",
          type: "image/png",
          width: 150,
          height: 150,
          secureUrl:
            "https://strapi-hookah-images.s3.us-east-1.amazonaws.com/logo_b8a1bc1da6.png"
        },
        {
          url: "https://strapi-hookah-images.s3.us-east-1.amazonaws.com/logo_with_full_name_f0d133e35b.png",
          type: "image/png",
          width: 500,
          height: 300,
          secureUrl:
            "https://strapi-hookah-images.s3.us-east-1.amazonaws.com/logo_with_full_name_f0d133e35b.png"
        }
      ],
      type: "website",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}`,
      locale: locale === "uk" ? "uk_UA" : "ru_RU"
    }
  };
}
