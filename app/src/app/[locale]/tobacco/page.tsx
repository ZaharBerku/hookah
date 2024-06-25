import { SectionFAQ } from "@/compoents/organisms/SectionFAQ";
import { ProductsPage } from "@/compoents/pages";
import { GET_CATEGORY_PRODUCTS_QUERY } from "@/query/schema";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { getQuery } from "@/lib/server";
import { getLocale } from "@/utils/helpers";
import { locales } from "@/utils/navigation";

export default async function Tobacco({
  params,
  searchParams
}: {
  params: { locale: "uk" | "ru" };
  searchParams: {
    brands: string;
  };
}) {
  const t = await getTranslations({
    locale: getLocale(params),
    namespace: "Tobacco"
  });

  const { loading, error, data } = await getQuery({
    params,
    query: GET_CATEGORY_PRODUCTS_QUERY,
    variables: {
      category: "tobacco",
      limit: 150,
      brands: searchParams.brands?.split(",") || []
    }
  });

  if (error) notFound();

  return (
    <>
      <ProductsPage
        loading={loading}
        data={data.products.data}
        label={t("title")}
        brands={data.brands.data}
      />
      <SectionFAQ nameTranslations={"Tobacco.Main"} params={params} />
    </>
  );
}

export async function generateMetadata({
  params
}: {
  params: { locale: "uk" | "ru" };
}) {
  const locale = locales.includes(params.locale) ? params.locale : "uk";
  const t = await getTranslations({ locale, namespace: "Tobacco.Metadata" });
  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
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
