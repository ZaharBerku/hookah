import { Head } from "@/compoents/molecules";
import { SectionFAQ } from "@/compoents/organisms/SectionFAQ";
import { ProductsPage } from "@/compoents/pages";
import { GET_ALL_BRANDS_QUERY } from "@/query/brand";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { getQuery } from "@/lib/server";
import { getLocale } from "@/utils/helpers";
import { Category } from "@/utils/types";

export default async function Tobacco({
  params
}: {
  params: { locale: "uk" | "ru" };
}) {
  const locale = getLocale(params);
  const tFAQ = await getTranslations({ locale, namespace: "Tobacco.Main" });
  const t = await getTranslations({
    locale,
    namespace: "Tobacco"
  });
  const tBreadcrumb = await getTranslations({
    locale,
    namespace: "Breadcrumb"
  });

  const { error, data, loading } = await getQuery({
    params,
    query: GET_ALL_BRANDS_QUERY,
    variables: {
      category: Category.TOBACCO
    }
  });

  if (error) notFound();

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
        name: tBreadcrumb("tobacco"),
        item: `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/tobacco`
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
        category={Category.TOBACCO}
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
  const locale = getLocale(params);
  const t = await getTranslations({ locale, namespace: "Tobacco.Metadata" });
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
