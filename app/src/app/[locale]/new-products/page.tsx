import { ProductsPage } from "@/componets/pages";
import { GET_NEW_PRODUCTS_QUERY } from "@/query/schema";
import { getTranslations } from "next-intl/server";

import { getLocale } from "@/utils/helpers";
import { buildAlternates } from "@/utils/seo/alternates";

export const dynamic = "force-dynamic";

export default async function NewProducts({
  params
}: {
  params: { locale: "uk" | "ru" };
}) {
  const t = await getTranslations({
    locale: getLocale(params),
    namespace: "NewProducts"
  });

  return (
    <ProductsPage
      label={t("title")}
      quary={GET_NEW_PRODUCTS_QUERY}
      defaultFilter={{
        numberOf: { gt: 0 }
      }}
      defaultPageFilter="/category"
    />
  );
}

export async function generateMetadata({
  params
}: {
  params: { locale: "uk" | "ru" };
}) {
  return { alternates: buildAlternates(getLocale(params), "new-products") };
}
