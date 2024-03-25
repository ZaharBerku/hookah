import { Header, Wrapper } from "@/compoents/atoms";
import {
  Banner,
  Logo,
  Catalog,
  MainSearch,
  ShoppingCart,
  SwitchLanguage
} from "@/compoents/molecules";
import { FC } from "react";

interface RootHeaderProps {
  menu?: string;
}

const RootHeader: FC<RootHeaderProps> = ({ menu }) => {
  return (
    <Header className="w-full bg-black">
      <Banner />
      <Wrapper className="w-full py-4 flex items-center gap-8 md:gap-12 justify-between">
        <Logo />
        <Catalog />
        <MainSearch />
        <SwitchLanguage />
        <ShoppingCart />
      </Wrapper>
    </Header>
  );
};

export { RootHeader };
