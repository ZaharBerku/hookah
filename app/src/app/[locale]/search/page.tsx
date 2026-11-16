import { SearchPage } from "@/componets/pages";
import { getTranslations } from "next-intl/server";

export default async function Search(props: {
  searchParams: Promise<{ seach: string }>;
  params: Promise<{ locale: "uk" | "ru" }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
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
