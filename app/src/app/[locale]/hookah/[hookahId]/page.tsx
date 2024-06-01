import { HookahProductPage } from "@/compoents/pages";
import {
  GET_ALL_HOOKAH_PRODUCT_IDS_QUERY,
  GET_HOOKAH_PRODUCT_QUERY
} from "@/query/hookah";
import { notFound } from "next/navigation";

import { getClient } from "@/lib/server";

export default async function HookahProduct({
  searchParams
}: {
  searchParams: {
    productId: string;
  };
}) {
  const { loading, error, data } = await getClient().query({
    query: GET_HOOKAH_PRODUCT_QUERY,
    variables: {
      id: searchParams.productId
    }
  });
  if (error) notFound();

  return <HookahProductPage data={data.product.data} loading={loading} />;
}

export const generateStaticParams = async () => {
  const { data } = await getClient().query({
    query: GET_ALL_HOOKAH_PRODUCT_IDS_QUERY
  });

  return data.products.data.map((prodcut: any) => ({
    hookahId: prodcut.attributes.name,
    searchParams: {
      productId: prodcut.id.toString()
    }
  }));
};
