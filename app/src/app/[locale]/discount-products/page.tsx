import { ProductsPage } from "@/compoents/pages";
import { GET_DISCOUNT_PRODUCTS_QUERY } from "@/query/schema";
import { getTranslations } from "next-intl/server";

import { getLocale } from "@/utils/helpers";

export default async function DiscountProducts({
  params
}: {
  params: { locale: "uk" | "ru" };
}) {
  const t = await getTranslations({
    locale: getLocale(params),
    namespace: "DiscountProducts"
  });

  return (
    <ProductsPage
      label={t("title")}
      quary={GET_DISCOUNT_PRODUCTS_QUERY}
      defaultFilter={{
        discount: { gt: 1 },
        numberOf: { gt: 0 }
      }}
    />
  );
}
