import { Header, Wrapper } from "@/compoents/atoms";
import {
  Banner,
  Logo,
  Catalog,
  MainSearch,
  ShoppingCart
} from "@/compoents/molecules";
import { FC } from "react";

interface RootHeaderProps {
  menu?: string;
}

const RootHeader: FC<RootHeaderProps> = ({ menu }) => {
  return (
    <Header className="w-full bg-black">
      <Banner />
      <Wrapper className="max-w-screen-xl m-auto w-full py-4 flex items-center gap-8 md:gap-12 justify-between">
        <Logo />
        <Catalog />
        <MainSearch />
        <ShoppingCart />
      </Wrapper>
    </Header>
  );
};

export { RootHeader };
