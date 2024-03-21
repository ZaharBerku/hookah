import { Header, Wrapper } from "@/compoents/atoms";
import { Breadcrumb } from "@/compoents/molecules";
import { FC } from "react";

interface RootHeaderProps {
  menu?: string;
}

const RootHeader: FC<RootHeaderProps> = ({ menu }) => {
  return (
    <Header className="w-full h-20 bg-black">
      <Wrapper className="max-w-screen-xl m-auto">
        <Breadcrumb
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
