import { Icon } from "@/compoents/atoms";
import Link from "next/link";
import { FC } from "react";

interface LogoProps {
  type?: "LogoWithNameIcon" | "LogoIcon" | "LogoWithNameBlackIcon";
  classes?: {
    link?: string;
    logo?: string;
  };
}

const Logo: FC<LogoProps> = ({ type = "LogoWithNameIcon", classes }) => {
  return (
    <Link className={classes?.link} href={"/"}>
      <Icon type={type} className={classes?.logo} />
    </Link>
  );
};

export { Logo };
