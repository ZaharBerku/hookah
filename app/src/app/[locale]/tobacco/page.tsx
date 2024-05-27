import { ProductsPage } from "@/compoents/pages";
// import { GET_ALL_HOOKAH_PRODUCTS_QUERY } from "@/query/hookah";
// import { getClient } from "@/lib/server";

export default function Hookah() {
  // const { loading, error, data } = await getClient().query({
  //   query: GET_ALL_HOOKAH_PRODUCTS_QUERY
  // });
  return <ProductsPage />;
}
