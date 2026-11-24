import { Icon } from "@/componets/atoms";
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
      {type === "LogoWithNameIcon" ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/images/logo-with-name.svg"
          width={170}
          height={38}
          loading="lazy"
          decoding="async"
          alt="Hookah Store"
          className={classes?.logo}
        />
      ) : (
        <Icon type={type} className={classes?.logo} />
      )}
    </Link>
  );
};

export { Logo };
