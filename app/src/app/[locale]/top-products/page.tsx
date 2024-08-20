import { ProductsPage } from "@/compoents/pages";
import { GET_TOP_PRODUCTS_QUERY } from "@/query/schema";
import { getTranslations } from "next-intl/server";

import { getLocale } from "@/utils/helpers";

export default async function TopProducts({
  params
}: {
  params: { locale: "uk" | "ru" };
}) {
  const t = await getTranslations({
    locale: getLocale(params),
    namespace: "TopProducts"
  });

  return (
    <ProductsPage
      label={t("title")}
      quary={GET_TOP_PRODUCTS_QUERY}
      defaultFilter={{
        numberOf: { gt: 0 }
      }}
      defaultPageFitler="/category"
    />
  );
}
