import { Main } from "@/compoents/atoms";
import { RootHeader, RootFooter } from "@/compoents/organisms";
import { getTranslations } from "next-intl/server";

export default async function Home() {
  const t = await getTranslations("Home");
  return (
    <>
      <RootHeader />
      <Main className="flex min-h-screen flex-col items-center justify-between p-24 bg-black h-10">
        <h1>{t("title")}</h1>
      </Main>
      <RootFooter />
    </>
  );
}
