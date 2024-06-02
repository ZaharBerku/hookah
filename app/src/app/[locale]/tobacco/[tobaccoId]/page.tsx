import { TobaccoProductPage } from "@/compoents/pages";
import {
  GET_TOBACCO_PRODUCT_QUERY
} from "@/query/tobacco";
import { notFound } from "next/navigation";

import { getQuery } from "@/lib/server";

export default async function HookahProduct({
  searchParams, params
}: {
  searchParams: {
    productId: string;
  };
  params: { locale: "uk" | "ru" }
}) {
  const { loading, error, data } = await getQuery({
    params,
    query: GET_TOBACCO_PRODUCT_QUERY,
    variables: {
      id: searchParams.productId
    }
  });
  if (error) notFound();

  return <TobaccoProductPage loading={loading} data={data.product.data} />;
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
