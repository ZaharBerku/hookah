import { Header, Wrapper } from "@/compoents/atoms";
import { Breadcrumb } from "@/compoents/molecules";

const RootHeader = () => {
  return (
    <Header className="bg-black w-full h-20">
      <Wrapper className="max-w-screen-xl m-auto">
        <Breadcrumb
          homeElement={"Home"}
          separator={<span> | </span>}
          activeClasses="text-amber-500"
          containerClasses="flex py-5 bg-gradient-to-r from-purple-600 to-blue-600"
          listClasses="hover:underline mx-2 font-bold"
          capitalizeLinks
        />
      </Wrapper>
    </Header>
  );
};

export { RootHeader };
