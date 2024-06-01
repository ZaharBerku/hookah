import { TobaccoProductPage } from "@/compoents/pages";
import {
  GET_ALL_TOBACCO_PRODUCT_IDS_QUERY,
  GET_TOBACCO_PRODUCT_QUERY
} from "@/query/tobacco";
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
    query: GET_TOBACCO_PRODUCT_QUERY,
    variables: {
      id: searchParams.productId
    }
  });
  if (error) notFound();

  return <TobaccoProductPage loading={loading} data={data.product.data} />;
}

export const generateStaticParams = async () => {
  const { data } = await getClient().query({
    query: GET_ALL_TOBACCO_PRODUCT_IDS_QUERY
  });

  return data.products.data.map((prodcut: any) => ({
    tobaccoId: prodcut.attributes.name,
    searchParams: {
      productId: prodcut.id.toString()
    }
  }));
};
