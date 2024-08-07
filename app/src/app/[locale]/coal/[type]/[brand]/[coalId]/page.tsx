import { TobaccoProductPage } from "@/compoents/pages";
import { GET_TOBACCO_PRODUCT_BY_COMPOSITE_ID_QUERY } from "@/query/tobacco";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { getQuery } from "@/lib/server";
import { getLocale } from "@/utils/helpers";

export default async function CoalProduct({
  params
}: {
  params: { locale: "uk" | "ru"; coalId: string };
}) {
  const { loading, error, data } = await getQuery({
    params,
    query: GET_TOBACCO_PRODUCT_BY_COMPOSITE_ID_QUERY,
    variables: {
      compositeId: params.coalId
    }
  });

  if (error) notFound();

  return (
    <TobaccoProductPage loading={loading} data={data.products.data?.at(0)} />
  );
}

export async function generateMetadata({
  params
}: {
  params: { locale: "uk" | "ru"; coalId: string };
}) {
  const locale = getLocale(params);
  const { data } = await getQuery({
    params,
    query: GET_TOBACCO_PRODUCT_BY_COMPOSITE_ID_QUERY,
    variables: {
      compositeId: params.coalId
    }
  });
  const product = data.products.data?.at(0).attributes;
  const image = product.previewImage.data.attributes.url;
  const slugBrand = product.brand.data.attributes.slug;
  const t = await getTranslations({
    locale,
    namespace: "Coal.Product.Metadata"
  });
  return {
    title: t("title", { name: product.name }),
    description: t("description", { name: product.name }),
    openGraph: {
      title: t("title", { name: product.name }),
      description: t("description", { name: product.name }),
      siteName: t("title", { name: product.name }),
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
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/coal/${slugBrand}/${product.compositeId}`,
      locale: locale === "uk" ? "uk_UA" : "ru_RU"
    }
  };
}
