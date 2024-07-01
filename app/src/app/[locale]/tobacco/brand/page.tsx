// import { TobaccoProductPage } from "@/compoents/pages";
import { GET_TOBACCO_PRODUCT_BY_COMPOSITE_ID_QUERY } from "@/query/tobacco";
import { notFound } from "next/navigation";

import { getQuery } from "@/lib/server";
import { getLocale } from "@/utils/helpers";

export default async function Brands({
  params
}: {
  params: { locale: "uk" | "ru" };
}) {
  // const { loading, error, data } = await getQuery({
  //   params,
  //   query: GET_TOBACCO_PRODUCT_BY_COMPOSITE_ID_QUERY,
  //   variables: {
  //     compositeId: params.tobaccoId
  //   }
  // });
  // if (error) notFound();

  return <>test</>;
}
