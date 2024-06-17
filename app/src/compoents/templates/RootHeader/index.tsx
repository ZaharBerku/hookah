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
      <Wrapper className="w-full box-border mx-5">
        <div className="flex items-center gap-2 md:gap-8 border-b md:border-none justify-between py-4">
          <Logo classes={{ link: "hidden md:block" }} />
          <Catalog />
          <Sidebar isCloseBanner={isCloseBanner} />
          <Logo type="LogoIcon" classes={{ link: "block md:hidden" }} />
          <MainSearch />
          <SwitchLanguage className="hidden md:block" />
          <ShoppingCart />
        </div>
      </Wrapper>
    </Header>
  );
};

export { RootHeader };
