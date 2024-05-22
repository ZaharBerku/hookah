import { HookahProductPage } from "@/compoents/pages";
// import { GET_HOOKAH_PRODUCT_QUERY } from "@/query/hookah";

// import { getClient } from "@/lib/server";

export default async function HookahProduct({
  searchParams
}: {
  searchParams: {
    productId: string;
  };
}) {
  // const { loading, error, data } = await getClient().query({
  //   query: GET_HOOKAH_PRODUCT_QUERY,
  //   variables: {
  //     id: searchParams.productId
  //   }
  // });
  // console.log(data, "data");
  return <HookahProductPage />;
}
