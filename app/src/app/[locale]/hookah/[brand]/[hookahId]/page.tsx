import { HookahProductPage } from "@/compoents/pages";
import { GET_HOOKAH_PRODUCT_BY_COMPOSITE_ID_QUERY } from "@/query/hookah";
import { notFound } from "next/navigation";

import { getQuery } from "@/lib/server";

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
