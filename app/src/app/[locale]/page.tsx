import { RootFooter, RootMain } from "@/compoents/organisms";
import { GETQUERY } from "@/query/schema";

import { getClient } from "@/lib/server";

export default async function Home() {
  const { data } = await getClient().query({ query: GETQUERY });
  console.log(data, "data");
  return (
    <>
      <RootMain>
        <h1 className="text-white">{}</h1>
      </RootMain>
      <RootFooter />
    </>
  );
}
