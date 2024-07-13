import { TobaccoProductPage } from "@/compoents/pages";
import { GET_TOBACCO_PRODUCT_BY_COMPOSITE_ID_QUERY } from "@/query/tobacco";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { getQuery } from "@/lib/server";
import { getLocale } from "@/utils/helpers";

export default async function TobaccoProduct({
  params
}: {
  params: { locale: "uk" | "ru"; tobaccoId: string };
}) {
  const { loading, error, data } = await getQuery({
    params,
    query: GET_TOBACCO_PRODUCT_BY_COMPOSITE_ID_QUERY,
    variables: {
      compositeId: params.tobaccoId
    }
  });

  if (error) notFound();

  return (
    <TobaccoProductPage loading={loading} data={data.products.data?.at(0)} />
  );
}

// export const generateStaticParams = async ({
//                                               params
//                                            }: {
//   params: { locale: "uk" | "ru" }
// }) => {
//   const { data } = await getQuery({
//     params,
//     query: GET_ALL_TOBACCO_PRODUCT_IDS_QUERY
//   });
//
//   return data.products.data.map((prodcut: any) => ({
//     tobaccoId: prodcut.attributes.name,
//     searchParams: {
//       productId: prodcut.id.toString()
//     }
//   }));
// };

export async function generateMetadata({
  params
}: {
  params: { locale: "uk" | "ru"; tobaccoId: string };
}) {
  const locale = getLocale(params);
  const { data } = await getQuery({
    params,
    query: GET_TOBACCO_PRODUCT_BY_COMPOSITE_ID_QUERY,
    variables: {
      compositeId: params.tobaccoId
    }
  });
  const product = data.products.data?.at(0).attributes;
  const image = product.previewImage.data.attributes.url;
  const slugBrand = product.brand.data.attributes.slug;
  const t = await getTranslations({
    locale,
    namespace: "Tobacco.Product.Metadata"
  });
  return {
    title: t("title", { name: product.name }),
    description: t("description", { name: product.name }),
    openGraph: {
      title: t("title", { name: product.name }),
      description: t("description", { name: product.name }),
      images: [
        {
          url: image,
          type: "image/png",
          width: 150,
          height: 150,
          secureUrl: image
        }
      ],
      type: "website",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/tobacco/${slugBrand}/${product.compositeId}`,
      locale: locale === "uk" ? "uk_UA" : "ru_RU"
    }
  };
}
