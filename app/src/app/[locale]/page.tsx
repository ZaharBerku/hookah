import { RootHeader, RootFooter, RootMain } from "@/compoents/organisms";
import { getTranslations } from "next-intl/server";

export default async function Home() {
  const t = await getTranslations("Header");
  return (
    <>
      <RootHeader menu={t('menu')} />
      <RootMain>
        <h1 className="text-white">{}</h1>
      </RootMain>
      <RootFooter />
    </>
  );
}
