import { Header, Wrapper } from "@/compoents/atoms";
import { Banner, MainSearch } from "@/compoents/molecules";
import LogoNameIcon from "@/public/icons/logo-with-name.svg";
import Link from "next/link";
import { FC } from "react";

interface RootHeaderProps {
  menu?: string;
}

const RootHeader: FC<RootHeaderProps> = ({ menu }) => {
  return (
    <Header className="w-full">
      <Banner />
      <Wrapper className="max-w-screen-xl m-auto w-full py-4 bg-black flex">
        <Link href={"/"}>
          <LogoNameIcon />
        </Link>
        <MainSearch />
      </Wrapper>
    </Header>
  );
};

export { RootHeader };
