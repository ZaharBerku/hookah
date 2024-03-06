import { RootFooter, RootMain } from "@/compoents/organisms";

export default async function Home() {

  return (
    <>
      <RootMain>
        <h1 className="text-white">{}</h1>
      </RootMain>
      <RootFooter />
    </>
  );
}
