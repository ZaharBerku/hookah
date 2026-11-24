import { Icon } from "@/componets/atoms";
import cx from "clsx";
import Link from "next/link";
import { FC } from "react";

const BLANK_IMAGE =
  "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

const IMAGES = {
  LogoWithNameIcon: {
    src: "/images/logo-with-name.svg",
    width: 170,
    height: 38,
    size: "h-[38px] w-[170px]"
  },
  LogoIcon: {
    src: "/images/logo.svg",
    width: 37,
    height: 38,
    size: "h-[38px] w-[37px]"
  }
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
  const image = type in IMAGES ? IMAGES[type as ImageType] : undefined;
  const img = image && (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={media ? BLANK_IMAGE : image.src}
      width={image.width}
      height={image.height}
      loading={media ? "eager" : "lazy"}
      decoding="async"
      alt="Hookah Store"
      className={cx(image.size, "max-w-none", classes?.logo)}
    />
  );
  return (
    <Link className={classes?.link} href={"/"}>
      {!image ? (
        <Icon type={type} className={classes?.logo} />
      ) : media ? (
        <picture>
          <source media={media} srcSet={image.src} />
          {img}
        </picture>
      ) : (
        img
      )}
    </Link>
  );
};

export { Logo };
