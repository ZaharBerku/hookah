import { Icon } from "@/componets/atoms";
import cx from "clsx";
import Link from "next/link";
import { FC } from "react";

import logoWithName from "@/assets/logo-with-name.svg?url";
import logo from "@/assets/logo.svg?url";

const BLANK_IMAGE =
  "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

const IMAGES = {
  LogoWithNameIcon: { image: logoWithName, size: "h-[38px] w-[170px]" },
  LogoIcon: { image: logo, size: "h-[38px] w-[37px]" }
} as const;

type ImageType = keyof typeof IMAGES;

interface LogoProps {
  type?: ImageType | "LogoWithNameBlackIcon";
  /** Viewport the logo is visible at: loads eagerly there and is not requested elsewhere. */
  media?: string;
  classes?: {
    link?: string;
    logo?: string;
  };
}

const Logo: FC<LogoProps> = ({ type = "LogoWithNameIcon", media, classes }) => {
  const entry = type in IMAGES ? IMAGES[type as ImageType] : undefined;
  const img = entry && (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={media ? BLANK_IMAGE : entry.image.src}
      width={entry.image.width}
      height={entry.image.height}
      loading={media ? "eager" : "lazy"}
      decoding="async"
      alt="Hookah Store"
      className={cx(entry.size, "max-w-none", classes?.logo)}
    />
  );
  return (
    <Link className={classes?.link} href={"/"}>
      {!entry ? (
        <Icon type={type} className={classes?.logo} />
      ) : media ? (
        <picture>
          <source media={media} srcSet={entry.image.src} />
          {img}
        </picture>
      ) : (
        img
      )}
    </Link>
  );
};

export { Logo };
