import { SearchPage } from "@/compoents/pages";

export default async function Search({
  searchParams
}: {
  searchParams: { seach: string };
}) {
  return (
    <SearchPage
      value={searchParams.seach}
      label={`Пошук - ${searchParams.seach}`}
    />
  );
}
