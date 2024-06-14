import { TobaccoProductPage } from "@/compoents/pages";
import { GET_TOBACCO_PRODUCT_BY_COMPOSITE_ID_QUERY } from "@/query/tobacco";
import { notFound } from "next/navigation";

import { getQuery } from "@/lib/server";

export default async function HookahProduct({
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

  return <TobaccoProductPage loading={loading} data={data.products.data?.at(0)} />;
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
