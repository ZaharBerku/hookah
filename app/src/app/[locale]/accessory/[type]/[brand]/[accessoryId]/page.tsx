import { AccessoryProductPage } from "@/componets/pages";
import { GET_ACCESSORY_PRODUCT_BY_COMPOSITE_ID_QUERY } from "@/query/accessory";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { getQuery } from "@/lib/server";
import { getLocale } from "@/utils/helpers";
import { replaceS3WithCDN } from "@/utils/helpers/replaceS3WithCDN";
import { buildAlternates } from "@/utils/seo/alternates";
import { getProductPath } from "@/utils/seo/productPath";

type ProductParams = { locale: "uk" | "ru"; accessoryId: string };

async function getAccessoryProduct(params: ProductParams) {
  const { loading, error, data } = await getQuery({
    params,
    query: GET_ACCESSORY_PRODUCT_BY_COMPOSITE_ID_QUERY,
    variables: {
      compositeId: params.accessoryId
    }
  });

  const entry = data?.products?.data?.at(0);
  const path = getProductPath(entry?.attributes);
  if (error || path?.[0] !== "accessory") notFound();

  return { entry, loading, path };
}

export const dynamic = "force-dynamic";

export default async function AccessoryProduct({
  params
}: {
  params: ProductParams;
}) {
  const { entry, loading } = await getAccessoryProduct(params);
  return <AccessoryProductPage loading={loading} data={entry} />;
}

export async function generateMetadata({ params }: { params: ProductParams }) {
  const locale = getLocale(params);
  const { entry, path } = await getAccessoryProduct(params);
  const product = entry.attributes;
  const image = replaceS3WithCDN(product.previewImage.data.attributes.url);
  const alternates = buildAlternates(locale, path.join("/"));
  const t = await getTranslations({
    locale,
    namespace: "Accessory.Product.Metadata"
  });
  return {
    title: t("title", { name: product.name }),
    description: t("description", { name: product.name }),
    alternates,
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
      url: alternates.canonical,
      locale: locale === "uk" ? "uk_UA" : "ru_UA"
    }
  };
}
