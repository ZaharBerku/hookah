import { RootHeader, RootFooter, RootMain } from "@/compoents/organisms";
import { getTranslations } from "next-intl/server";

export default async function Home() {
  const t = await getTranslations("Home");
  return (
    <>
      <RootHeader />
      <RootMain>
        <h1>{t("title")}</h1>
      </RootMain>
      <RootFooter />
    </>
  );
}
