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
  isCloseBanner?: boolean;
}

const RootHeader: FC<RootHeaderProps> = ({ isCloseBanner }) => {
  return (
    <Header className="w-full bg-white sticky top-0 md:bg-black flex flex-col justify-center items-center z-50">
      {!isCloseBanner && <Banner />}
      <Wrapper className="w-full box-border py-4 flex items-center gap-2 md:gap-12 border-b md:border-none mx-5 justify-between">
        <Logo />
        <Catalog />
        <Sidebar isCloseBanner={isCloseBanner} />
        <MainSearch />
        <SwitchLanguage className="hidden md:block" />
        <ShoppingCart />
      </Wrapper>
    </Header>
  );
};

export { RootHeader };
