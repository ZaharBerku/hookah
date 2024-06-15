import { HomePage } from "@/compoents/pages";
import { GET_ALL_PRODUCTS_QUERY } from "@/query/schema";
import { notFound } from "next/navigation";

import { getQuery } from "@/lib/server";
import { SectionFAQ } from "@/compoents/organisms/SectionFAQ";

export default async function Home({
  params
}: {
  params: { locale: "uk" | "ru" };
}) {
  const { loading, error, data } = await getQuery({
    params,
    query: GET_ALL_PRODUCTS_QUERY,
    variables: {
      limit: 50
    }
  });
  if (error) notFound();

  return (
    <>
      <HomePage loading={loading} data={data.products.data} />
      <SectionFAQ nameTranslations={"Home.Main"} params={params} />
    </>
  );
}
