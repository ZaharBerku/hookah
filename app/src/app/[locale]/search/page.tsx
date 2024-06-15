import { SearchPage } from "@/compoents/pages";
import { SEARCH_PRODUCTS_QUERY } from "@/query/schema";
import { notFound } from "next/navigation";

import { getQuery } from "@/lib/server";

export default async function Search({
  params,
  searchParams
}: {
  params: { locale: "uk" | "ru" };
  searchParams: { seach: string };
}) {
  const { loading, error, data } = await getQuery({
    params,
    query: SEARCH_PRODUCTS_QUERY,
    variables: {
      name: searchParams.seach,
      limit: 50
    }
  });

  if (error) notFound();
  return (
    <SearchPage
      loading={loading}
      data={data.products.data}
      label={`Пошук - ${searchParams.seach}`}
    />
  );
}
