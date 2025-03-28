import { AccessoryProductPage } from "@/componets/pages";
import { GET_ACCESSORY_PRODUCT_BY_COMPOSITE_ID_QUERY } from "@/query/accessory";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { getQuery } from "@/lib/server";
import { getLocale } from "@/utils/helpers";
import { replaceS3WithCDN } from "@/utils/helpers/replaceS3WithCDN";

export default async function AccessoryProduct({
  params
}: {
  params: { locale: "uk" | "ru"; accessoryId: string };
}) {
  const { loading, error, data } = await getQuery({
    params,
    query: GET_ACCESSORY_PRODUCT_BY_COMPOSITE_ID_QUERY,
    variables: {
      compositeId: params.accessoryId
    }
  });

  if (error) notFound();

  return (
    <AccessoryProductPage loading={loading} data={data.products.data?.at(0)} />
  );
}

export async function generateMetadata({
  params
}: {
  params: {
    locale: "uk" | "ru";
    accessoryId: string;
    brand: string;
    type: string;
  };
}) {
  const locale = getLocale(params);
  const { data } = await getQuery({
    params,
    query: GET_ACCESSORY_PRODUCT_BY_COMPOSITE_ID_QUERY,
    variables: {
      compositeId: params.accessoryId
    }
  });
  const product = data.products.data?.at(0).attributes;
  const image = replaceS3WithCDN(product.previewImage.data.attributes.url);
  const slugBrand = product.brand.data.attributes.slug;
  const t = await getTranslations({
    locale,
    namespace: "Accessory.Product.Metadata"
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
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/accessory/${params.type}/${slugBrand}/${product.compositeId}`,
      locale: locale === "uk" ? "uk_UA" : "ru_UA"
    }
  };
}
