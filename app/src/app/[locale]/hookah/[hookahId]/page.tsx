import { HookahProductPage } from "@/compoents/pages";
import {
  GET_HOOKAH_PRODUCT_QUERY
} from "@/query/hookah";
import { notFound } from "next/navigation";

import { getQuery } from "@/lib/server";

export default async function HookahProduct({
  searchParams, params
}: {
  searchParams: {
    productId: string;
  },
  params: { locale: "uk" | "ru" }
}) {
  const { loading, error, data } = await getQuery({
    params,
    query: GET_HOOKAH_PRODUCT_QUERY,
    variables: {
      id: searchParams.productId
    }
  });
  if (error) notFound();

  return <HookahProductPage data={data.product.data} loading={loading} />;
}

// export const generateStaticParams = async ({
//                                              params
//                                            }: {
//   params: { locale: "uk" | "ru" }
// }) => {
//   const { data } = await getQuery({
//     params,
//     query: GET_ALL_HOOKAH_PRODUCT_IDS_QUERY
//   });
//
//   return data.products.data.map((prodcut: any) => ({
//     hookahId: prodcut.attributes.name,
//     searchParams: {
//       productId: prodcut.id.toString()
//     }
//   }));
// };
