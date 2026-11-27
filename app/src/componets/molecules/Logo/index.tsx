import cx from "clsx";
import Link from "next/link";
import { FC } from "react";

import logoWithNameBlack from "@/assets/logo-with-name-black.svg?url";
import logoWithName from "@/assets/logo-with-name.svg?url";
import logo from "@/assets/logo.svg?url";

const BLANK_IMAGE =
  "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

const IMAGES = {
  LogoWithNameIcon: { image: logoWithName, size: "h-[38px] w-[170px]" },
  LogoWithNameBlackIcon: {
    image: logoWithNameBlack,
    size: "h-[38px] w-[170px]"
  },
  LogoIcon: { image: logo, size: "h-[38px] w-[37px]" }
} as const;

interface LogoProps {
  type?: keyof typeof IMAGES;
  /** Viewport the logo is visible at: loads eagerly there and is not requested elsewhere. */
  media?: string;
  classes?: {
    link?: string;
    logo?: string;
  };
}

const Logo: FC<LogoProps> = ({ type = "LogoWithNameIcon", media, classes }) => {
  const entry = IMAGES[type];
  const img = (
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
      {media ? (
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
