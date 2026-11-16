import { ProductsPage } from "@/componets/pages";
import { GET_NEW_PRODUCTS_QUERY } from "@/query/schema";
import { getTranslations } from "next-intl/server";

import { getLocale } from "@/utils/helpers";

export default async function NewProducts(props: {
  params: Promise<{ locale: "uk" | "ru" }>;
}) {
  const params = await props.params;
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
