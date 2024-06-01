import { ProductsPage } from "@/compoents/pages";
import { GET_CATEGORY_PRODUCTS_QUERY } from "@/query/schema";
import { notFound } from "next/navigation";

import { getClient } from "@/lib/server";

export default async function Tobacco() {
  const { loading, error, data } = await getClient().query({
    query: GET_CATEGORY_PRODUCTS_QUERY,
    variables: {
      category: "tobacco"
    }
  });

  if (error) notFound();
  console.log(data, "data");
  return (
    <ProductsPage
      loading={loading}
      data={data.products.data}
      label={"Табак"}
      brands={data.brands.data}
    />
  );
}
