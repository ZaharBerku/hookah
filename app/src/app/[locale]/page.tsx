import { RootFooter, RootMain, RootHeader } from "@/compoents/organisms";
import { cookies } from "next/headers";

import { cookiesKeys } from "@/utils/variables";

export default async function Home() {
  const cookieStore = cookies();
  const isCloseBanner =
    cookieStore.get(cookiesKeys.isCloseBanner)?.value === "true";

  return (
    <>
      <RootHeader isCloseBanner={isCloseBanner} />
      <RootMain></RootMain>
      <RootFooter />
    </>
  );
}
