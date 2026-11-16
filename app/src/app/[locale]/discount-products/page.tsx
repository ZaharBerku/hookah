import { ProductsPage } from "@/componets/pages";
import { GET_DISCOUNT_PRODUCTS_QUERY } from "@/query/schema";
import { getTranslations } from "next-intl/server";

import { getLocale } from "@/utils/helpers";

export default async function DiscountProducts(props: {
  params: Promise<{ locale: "uk" | "ru" }>;
}) {
  const params = await props.params;
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
      defaultPageFilter="/category"
    />
  );
}
