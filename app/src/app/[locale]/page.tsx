import { HomePage } from "@/compoents/pages";
// import { GET_ALL_PRODUCTS_QUERY } from "@/query/schema";

// import { getClient } from "@/lib/server";

export default async function Home() {
  // const { loading, error, data } = await getClient().query({
  //   query: GET_ALL_PRODUCTS_QUERY
  // });

  return <HomePage />;
}
