import { Header, Wrapper } from "@/compoents/atoms";
import {
  Banner,
  Logo,
  Catalog,
  MainSearch,
  ShoppingCart,
  SwitchLanguage,
  Sidebar
} from "@/compoents/molecules";
import { FC } from "react";

interface RootHeaderProps {
  menu?: string;
}

const RootHeader: FC<RootHeaderProps> = () => {
  return (
    <Header className="w-full bg-white md:bg-black flex flex-col justify-center items-center">
      <Banner />
      <Wrapper className="w-full box-border py-4 flex items-center gap-2 md:gap-12 border-b md:border-none mx-5 justify-between">
        <Logo />
        <Catalog />
        <Sidebar isBannerOpen={true} />
        <MainSearch />
        <SwitchLanguage className="hidden md:block" />
        <ShoppingCart />
      </Wrapper>
    </Header>
  );
};

export { RootHeader };
