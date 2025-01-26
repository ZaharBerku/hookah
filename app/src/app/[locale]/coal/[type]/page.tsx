import { Head } from "@/componets/molecules";
import { SectionFAQ } from "@/componets/organisms/SectionFAQ";
import { ProductsPage } from "@/componets/pages";
import { GET_BRANDS_BY_TYPE_SLUG_QUERY } from "@/query/brand";
import { GET_TYPES_BY_SLUG_QUERY } from "@/query/type";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { getClient, getQuery } from "@/lib/server";
import { checkImageFormat, getLocale } from "@/utils/helpers";
import { Category } from "@/utils/types";

export default async function CoalType({
  params
}: {
  params: { locale: "uk" | "ru"; type: string };
}) {
  const locale = getLocale(params);
  const t = await getTranslations({
    locale,
    namespace: `Coal.Types.${params.type}`
  });

  const tBreadcrumb = await getTranslations({
    locale,
    namespace: "Breadcrumb"
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

  const mainEntity = t
    .raw("faq")
    .map(({ title, subtitle }: { title: string; subtitle: string }) => ({
      "@type": "Question",
      name: title,
      acceptedAnswer: {
        "@type": "Answer",
        text: subtitle
      }
    }));
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity
  };

  const breadcrumbsJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Головна",
        item: `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}`
      },
      {
        "@type": "ListItem",
        position: 2,
        name: tBreadcrumb("coal"),
        item: `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/coal`
      },
      {
        "@type": "ListItem",
        position: 3,
        name: tBreadcrumb(params.type),
        item: `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/coal/${params.type}`
      }
    ]
  };

  return (
    <>
      <Head structuredData={faqSchema} breadcrumbsJsonLd={breadcrumbsJsonLd} />
      <ProductsPage
        loading={loading}
        label={t("title")}
        list={data.brands.data}
        category={Category.COAL}
        type={params.type}
        defaultPageFitler={"/coal/*"}
      />
      <SectionFAQ
        nameTranslations={`Coal.Types.${params.type}`}
        params={params}
      />
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
  const { data } = await getClient().query({
    query: GET_TYPES_BY_SLUG_QUERY,
    variables: {
      slug: params.type
    }
  });
  const image =
    data.types?.data?.at(0)?.attributes?.logo?.data?.attributes?.url;
  const typeImage = checkImageFormat(image);
  return {
    title: t(`${params.type}.Metadata.title`),
    description: t(`${params.type}.Metadata.description`),
    openGraph: {
      title: t(`${params.type}.Metadata.title`),
      description: t(`${params.type}.Metadata.description`),
      siteName: t(`${params.type}.Metadata.title`),
      type: "website",
      images: [
        {
          url: image,
          type: `image/${typeImage}`,
          width: 200,
          height: 200,
          secureUrl: image
        }
      ],
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/coal/${params.type}`,
      locale: locale === "uk" ? "uk_UA" : "ru_UA"
    }
  };
}
