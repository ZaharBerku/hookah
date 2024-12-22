import { Header, Icon, Wrapper } from "@/compoents/atoms";
import {
  Banner,
  Logo,
  Catalog,
  MainSearch,
  ShoppingCart,
  SwitchLanguage,
  Sidebar
} from "@/compoents/molecules";
import { SnowEffect } from "@/compoents/organisms/SnowEffect";
import { FC } from "react";

interface RootHeaderProps {
  isCloseBanner?: boolean;
}

const RootHeader: FC<RootHeaderProps> = ({ isCloseBanner }) => {
  return (
    <Header className="w-full bg-white sticky top-0 md:bg-black flex flex-col justify-center items-center z-50">
      {!isCloseBanner && <Banner />}
      <SnowEffect />
      <Wrapper className="w-full box-border mx-5 relative">
        <div className="flex items-center gap-2 md:gap-8 border-b md:border-none justify-between py-4">
        <Icon
            type="NewYearTreeLeftIcon"
            className="fixed z-5 -left-10 xl:left-0 pointer-events-none"
          />
          <Logo classes={{ link: "hidden md:block" }} />
          <Catalog />
          <Sidebar isCloseBanner={isCloseBanner} />
          <Logo type="LogoIcon" classes={{ link: "block md:hidden" }} />
          <MainSearch />
          <SwitchLanguage className="hidden md:block" />
          <ShoppingCart />
          <Icon
            type="NewYearTreeRightIcon"
            className="fixed z-5 right-0 md:-right-5 xl:right-0 w-14 md:w-20 pointer-events-none"
          />
        </div>
      </Wrapper>
    </Header>
  );
};

export { RootHeader };
