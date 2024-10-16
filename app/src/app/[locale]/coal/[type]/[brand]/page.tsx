import { Head } from "@/compoents/molecules";
import { SectionFAQ } from "@/compoents/organisms/SectionFAQ";
import { BrandPage } from "@/compoents/pages";
import { GET_BRAND_BY_SLUG_QUERY } from "@/query/brand";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { getClient } from "@/lib/server";
import { getQuery } from "@/lib/server";
import { checkImageFormat, getLocale } from "@/utils/helpers";
import { Category } from "@/utils/types";

export default async function Brand({
  params
}: {
  params: { locale: "uk" | "ru"; brand: string; type: string };
}) {
  const locale = getLocale(params);
  const tBreadcrumb = await getTranslations({
    locale,
    namespace: "Breadcrumb"
  });
  const t = await getTranslations({
    locale,
    namespace: `Coal.Brands.${params.brand}`
  });

  const { loading, error, data } = await getQuery({
    params,
    query: GET_BRAND_BY_SLUG_QUERY,
    variables: {
      slug: params.brand,
      slugType: params.type
    }
  });

  if (error) notFound();
  const brandName = data.brands.data?.at(0)?.attributes?.name;
  const slugBrand = data.brands.data.at(0)?.attributes?.slug;
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
      },
      {
        "@type": "ListItem",
        position: 4,
        name: brandName,
        item: `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/coal/${params.type}/${slugBrand}`
      }
    ]
  };

  return (
    <>
      <Head structuredData={faqSchema} breadcrumbsJsonLd={breadcrumbsJsonLd} />
      <BrandPage
        loading={loading}
        label={data.brands?.data.at(0)?.attributes?.name}
        slugBrand={params.brand}
        category={Category.COAL}
        defaultPageFitler={"/coal/*"}
      />
      <SectionFAQ
        nameTranslations={`Coal.Brands.${params.brand}`}
        params={params}
      />
    </>
  );
}

export async function generateMetadata({
  params
}: {
  params: { locale: "uk" | "ru"; brand: string; type: string };
}) {
  const locale = getLocale(params);
  const { data } = await getClient().query({
    query: GET_BRAND_BY_SLUG_QUERY,
    variables: {
      slug: params.brand
    }
  });
  const brand = data.brands.data?.at(0)?.attributes;
  const image = brand.logo.data.attributes.url;
  const type = checkImageFormat(image);
  const t = await getTranslations({
    locale,
    namespace: "Coal.Brands"
  });
  return {
    title: t(`${params.brand}.Metadata.title`),
    description: t("description", { name: brand.name }),
    openGraph: {
      title: t(`${params.brand}.Metadata.title`),
      description: t("description", { name: brand.name }),
      siteName: t(`${params.brand}.Metadata.title`),
      images: [
        {
          url: image,
          type: `image/${type}`,
          width: 200,
          height: 200,
          secureUrl: image
        }
      ],
      type: "website",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/coal/${params.type}/${params.brand}`,
      locale: locale === "uk" ? "uk_UA" : "ru_UA"
    }
  };
}
