import { ProductsPage } from "@/compoents/pages";
import { GET_NEW_PRODUCTS_QUERY } from "@/query/schema";
import { getTranslations } from "next-intl/server";

import { getLocale } from "@/utils/helpers";

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
      defaultPageFitler="/category"
    />
  );
}
