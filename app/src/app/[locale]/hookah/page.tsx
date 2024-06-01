import { ProductsPage } from "@/compoents/pages";
import { GET_CATEGORY_PRODUCTS_QUERY } from "@/query/schema";
import { notFound } from "next/navigation";

import { getClient } from "@/lib/server";

export default async function Hookah() {
  const { loading, error, data } = await getClient().query({
    query: GET_CATEGORY_PRODUCTS_QUERY,
    variables: {
      category: "hookah"
    }
  });

  if (error) notFound();

  return (
    <ProductsPage
      data={data.products.data}
      loading={loading}
      label={"Кальяни"}
      brands={data.brands.data}
    />
  );
}
