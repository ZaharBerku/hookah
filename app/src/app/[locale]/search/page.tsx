import { SearchPage } from "@/compoents/pages";
import { SEARCH_PRODUCTS_QUERY } from "@/query/schema";
import { notFound } from "next/navigation";

import { getQuery } from "@/lib/server";

export default async function Search({
  params
}: {
  params: { locale: "uk" | "ru" };
}) {
  const { loading, error, data } = await getQuery({
    params,
    query: SEARCH_PRODUCTS_QUERY,
    variables: {
      category: "tobacco",
      limit: 50
    }
  });

  if (error) notFound();
  return (
    <SearchPage
      loading={loading}
      data={data.products.data}
      label={"Табак"}
      brands={data.brands.data}
    />
  );
}
