import { HookahProductPage } from "@/compoents/pages";
import { GET_HOOKAH_PRODUCT_BY_COMPOSITE_ID_QUERY } from "@/query/hookah";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { getQuery } from "@/lib/server";
import { getLocale } from "@/utils/helpers";

export default async function HookahProduct({
  params
}: {
  params: { locale: "uk" | "ru"; hookahId: string };
}) {
  const { loading, error, data } = await getQuery({
    params,
    query: GET_HOOKAH_PRODUCT_BY_COMPOSITE_ID_QUERY,
    variables: {
      compositeId: params.hookahId
    }
  });
  if (error) notFound();

  return (
    <HookahProductPage data={data.products.data?.at(0)} loading={loading} />
  );
}

export async function generateMetadata({
  params
}: {
  params: { locale: "uk" | "ru"; hookahId: string };
}) {
  const locale = getLocale(params);
  const { data } = await getQuery({
    params,
    query: GET_HOOKAH_PRODUCT_BY_COMPOSITE_ID_QUERY,
    variables: {
      compositeId: params.hookahId
    }
  });
  const product = data.products.data?.at(0).attributes;
  const image = product.previewImage.data.attributes.url;
  const slugBrand = product.brand.data.attributes.slug;
  const t = await getTranslations({
    locale,
    namespace: "Hookah.Product.Metadata"
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
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/hookah/${slugBrand}/${product.compositeId}`,
      locale: locale === "uk" ? "uk_UA" : "ru_RU"
    }
  };
}
