import { Head } from "@/componets/molecules";
import { SectionFAQ } from "@/componets/organisms/SectionFAQ";
import { BrandPage } from "@/componets/pages";
import { GET_BRAND_BY_SLUG_QUERY } from "@/query/brand";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { getClient } from "@/lib/server";
import { getQuery } from "@/lib/server";
import { getLocale } from "@/utils/helpers";
import { Category } from "@/utils/types";
import { replaceS3WithCDN } from "@/utils/helpers/replaceS3WithCDN";

export default async function Brand({
  params
}: {
  params: { locale: "uk" | "ru"; brand: string };
}) {
  const locale = getLocale(params);
  const t = await getTranslations({ locale, namespace: "Breadcrumb" });
  const tFAQ = await getTranslations({
    locale,
    namespace: `Hookah.Brands.${params.brand}`
  });
  const { loading, error, data } = await getQuery({
    params,
    query: GET_BRAND_BY_SLUG_QUERY,
    variables: {
      slug: params.brand
    }
  });
  if (error) notFound();
  const brandName = data.brands.data.at(0).attributes.name;
  const slugBrand = data.brands.data.at(0).attributes.slug;

  const mainEntity = tFAQ
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
        name: t("hookah"),
        item: `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/hookah`
      },
      {
        "@type": "ListItem",
        position: 3,
        name: brandName,
        item: `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/hookah/${slugBrand}`
      }
    ]
  };

  return (
    <>
      <Head structuredData={faqSchema} breadcrumbsJsonLd={breadcrumbsJsonLd} />
      <BrandPage
        loading={loading}
        label={data.brands.data.at(0).attributes.name}
        slugBrand={params.brand}
        category={Category.HOOKAH}
      />
      <SectionFAQ
        nameTranslations={`Hookah.Brands.${params.brand}`}
        params={params}
      />
    </>
  );
}

export async function generateMetadata({
  params
}: {
  params: { locale: "uk" | "ru"; brand: string };
}) {
  const locale = getLocale(params);
  const { data } = await getClient().query({
    query: GET_BRAND_BY_SLUG_QUERY,
    variables: {
      slug: params.brand
    }
  });
  const brand = data.brands.data?.at(0)?.attributes;
  const image = replaceS3WithCDN(brand.logo.data.attributes.url);
  const t = await getTranslations({
    locale,
    namespace: "Hookah.Brands"
  });
  return {
    title: t(`${params.brand}.Metadata.title`),
    description: t("description", { brand: brand.name }),
    openGraph: {
      title: t(`${params.brand}.Metadata.title`),
      description: t("description", { brand: brand.name }),
      siteName: t(`${params.brand}.Metadata.title`),
      images: [
        {
          url: image,
          type: "image/png",
          width: 200,
          height: 200,
          secureUrl: image
        }
      ],
      type: "website",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/hookah/${params.brand}`,
      locale: locale === "uk" ? "uk_UA" : "ru_UA"
    }
  };
}
