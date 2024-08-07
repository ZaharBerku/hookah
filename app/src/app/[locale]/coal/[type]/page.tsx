import { SectionFAQ } from "@/compoents/organisms/SectionFAQ";
import { ProductsPage } from "@/compoents/pages";
import { GET_BRANDS_BY_TYPE_SLUG_QUERY } from "@/query/brand";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { getQuery } from "@/lib/server";
import { getLocale } from "@/utils/helpers";
import { Category } from "@/utils/types";

export default async function CoalType({
  params
}: {
  params: { locale: "uk" | "ru"; type: string };
}) {
  const t = await getTranslations({
    locale: getLocale(params),
    namespace: `Coal.Types.${params.type}`
  });

  const { error, data, loading } = await getQuery({
    params,
    query: GET_BRANDS_BY_TYPE_SLUG_QUERY,
    variables: {
      slugType: params.type,
      category: Category.COAL
    }
  });
  if (error) notFound();

  return (
    <>
      <ProductsPage
        loading={loading}
        label={t("title")}
        list={data.brands.data}
        category={Category.COAL}
      />
      <SectionFAQ nameTranslations={`Coal.Types.${params.type}`} params={params} />
    </>
  );
}

export async function generateMetadata({
  params
}: {
  params: { locale: "uk" | "ru"; type: string };
}) {
  const locale = getLocale(params);
  const t = await getTranslations({
    locale,
    namespace: "Coal.Types"
  });
  return {
    title: t(`${params.type}.Metadata.title`),
    description: t(`${params.type}.Metadata.description`),
    openGraph: {
      title: t(`${params.type}.Metadata.title`),
      description: t(`${params.type}.Metadata.description`),
      siteName: t(`${params.type}.Metadata.title`),
      type: "website",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/coal/${params.type}`,
      locale: locale === "uk" ? "uk_UA" : "ru_RU"
    }
  };
}

