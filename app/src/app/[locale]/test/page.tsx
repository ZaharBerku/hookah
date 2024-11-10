import { Head } from "@/compoents/molecules";
import { SectionFAQ } from "@/compoents/organisms/SectionFAQ";
import { HomePageTest } from "@/compoents/pages";
import { GET_ALL_PRODUCTS_QUERY } from "@/query/schema";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { getQuery } from "@/lib/server";
import { getLocale } from "@/utils/helpers";

export default async function Home({
  params
}: {
  params: { locale: "uk" | "ru" };
}) {
  const locale = getLocale(params);
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const { loading, error, data } = await getQuery({
    params,
    query: GET_ALL_PRODUCTS_QUERY,
    variables: {
      limit: 15,
      discountLimit: 1
    }
  });

  if (error) notFound();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: t("title"),
    description: t("description"),
    url: "https://hookahstore.com.ua/uk",
    logo: "https://strapi-hookah-images.s3.us-east-1.amazonaws.com/logo_b8a1bc1da6.png",
    sameAs: [
      "https://www.instagram.com/hookahstore.ua/?igsh=MW5yNTFjM29hang4dw%3D%3D"
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+38 (063) 616-5809",
      contactType: "customer service",
      areaServed: "UA"
    }
  };

  return (
    <>
      <Head structuredData={structuredData} />
      <HomePageTest loading={loading} data={data} />
      <SectionFAQ nameTranslations={"Home.Main"} params={params} />
    </>
  );
}
