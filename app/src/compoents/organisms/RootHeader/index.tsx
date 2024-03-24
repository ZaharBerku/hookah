import { Header, Wrapper } from "@/compoents/atoms";
import { Banner, Logo, Catalog } from "@/compoents/molecules";
import { FC } from "react";

interface RootHeaderProps {
  menu?: string;
}

const RootHeader: FC<RootHeaderProps> = ({ menu }) => {
  return (
    <Header className="w-full">
      <Banner />
      <Wrapper className="max-w-screen-xl m-auto w-full py-4 bg-black flex">
        <Logo />
        <Catalog />
      </Wrapper>
    </Header>
  );
};

export { RootHeader };
