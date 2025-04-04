'use server'
import { Header, Wrapper } from "@/componets/atoms";
import {
  Banner,
  Logo,
  Catalog,
  MainSearch,
  ShoppingCart,
  SwitchLanguage,
  Sidebar
} from "@/componets/molecules";
// import { SnowEffect } from "@/componets/organisms/SnowEffect";
import type { FC } from "react";

import { getIsMobile } from "@/utils/helpers";

interface RootHeaderProps {
  isCloseBanner?: boolean;
}

const RootHeader: FC<RootHeaderProps> = ({ isCloseBanner }) => {
  const isMobile = getIsMobile();
  return (
    <Header className="w-full bg-white sticky top-0 md:bg-black flex flex-col justify-center items-center z-50">
      {!isCloseBanner && <Banner />}
      {/* //TODO new year animation */}
      {/* <SnowEffect /> */}
      <div className="w-full flex justify-center items-center relative">
        {/* //TODO new year animation */}
        {/* <Icon
          type="NewYearTreeLeftIcon"
          className="absolute z-5 -left-10 xl:left-0 pointer-events-none"
        /> */}
        <Wrapper className="w-full box-border relative">
          <div className="flex items-center gap-2 md:gap-8 border-b md:border-none justify-between py-4">
            {!isMobile && (
              <>
                <Logo classes={{ link: "hidden md:block" }} />
                <Catalog />
              </>
            )}
            <Sidebar isCloseBanner={isCloseBanner} />
            <Logo type="LogoIcon" classes={{ link: "block md:hidden" }} />
            <MainSearch />
            {!isMobile && <SwitchLanguage className="hidden md:block" />}
            <ShoppingCart />
          </div>
        </Wrapper>
        {/* //TODO new year animation */}
        {/* <Icon
          type="NewYearTreeRightIcon"
          className="absolute z-5 right-0 md:-right-5 xl:right-0 w-14 md:w-20 pointer-events-none"
        /> */}
      </div>
    </Header>
  );
};

export { RootHeader };
