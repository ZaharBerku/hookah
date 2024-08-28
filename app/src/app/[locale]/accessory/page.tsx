import { SectionFAQ } from "@/compoents/organisms/SectionFAQ";
import { ProductsPage } from "@/compoents/pages";
import { GET_TYPES_BY_CATEGORY_QUERY } from "@/query/type";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { getQuery } from "@/lib/server";
import { getLocale } from "@/utils/helpers";
import { locales } from "@/utils/navigation";
import { Category } from "@/utils/types";

export default async function Accessory({
  params
}: {
  params: { locale: "uk" | "ru" };
}) {
  const t = await getTranslations({
    locale: getLocale(params),
    namespace: "Coal"
  });

  const { error, data, loading } = await getQuery({
    params,
    query: GET_TYPES_BY_CATEGORY_QUERY,
    variables: {
      locale: getLocale(params),
      category: Category.ACCESSORY
    }
  });
  if (error) notFound();

  return (
    <>
      <ProductsPage
        loading={loading}
        label={t("title")}
        list={data.types.data}
        category={Category.ACCESSORY}
      />
      <SectionFAQ nameTranslations={"Coal.Main"} params={params} />
    </>
  );
}

export async function generateMetadata({
  params
}: {
  params: { locale: "uk" | "ru" };
}) {
  const locale = locales.includes(params.locale) ? params.locale : "uk";
  const t = await getTranslations({ locale, namespace: "Coal.Metadata" });
  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      siteName: t("title"),
      images: [
        {
          url: "https://strapi-hookah-images.s3.us-east-1.amazonaws.com/logo_b8a1bc1da6.png",
          type: "image/png",
          width: 200,
          height: 200,
          media: "(max-width: 600px)",
          secureUrl:
            "https://strapi-hookah-images.s3.us-east-1.amazonaws.com/logo_b8a1bc1da6.png"
        },
        {
          url: "https://strapi-hookah-images.s3.us-east-1.amazonaws.com/logo_with_full_name_f0d133e35b.png",
          type: "image/png",
          width: 500,
          height: 300,
          media: "(min-width: 601px)",
          secureUrl:
            "https://strapi-hookah-images.s3.us-east-1.amazonaws.com/logo_with_full_name_f0d133e35b.png"
        }
      ],
      type: "website",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}`,
      locale: locale === "uk" ? "uk_UA" : "ru_UA"
    }
  };
}
