import { SearchPage } from "@/compoents/pages";
import { getTranslations } from "next-intl/server";

export default async function Search({
  searchParams,
  params
}: {
  searchParams: { seach: string };
  params: { locale: "uk" | "ru" };
}) {
  const t = await getTranslations({
    locale: params.locale,
    namespace: "SearchPage"
  });
  return (
    <SearchPage
      value={searchParams.seach}
      label={`${t("title")} - ${searchParams.seach}`}
    />
  );
}
