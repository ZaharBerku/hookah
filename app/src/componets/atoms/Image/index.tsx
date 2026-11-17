"use client";

import clsx from "clsx";
import { type FC, type ImgHTMLAttributes, useEffect, useRef } from "react";

import { replaceS3WithCDN } from "@/utils/helpers/replaceS3WithCDN";
import type { TFormatsObject } from "@/utils/types";

const buildSrcSetForSmall = (
  formats: TFormatsObject,
  formatKey: "avif" | "webp" | "origin"
) => {
  const { small, thumbnail } = formats || {};
  if (thumbnail && small) {
    return Object.entries({ thumbnail, small })
      .map(([_, formatSet]) => {
        const format = formatSet[formatKey];
        return format?.url && format.width
          ? `${replaceS3WithCDN(format.url)} ${format.width}w`
          : null;
      })
      .filter(Boolean)
      .join(", ");
  }
};

const buildSrcSetForBig = (
  formats: TFormatsObject,
  formatKey: "avif" | "webp" | "origin"
) => {
  const { medium } = formats || {};
  if (medium) {
    return Object.entries({ medium })
      .map(([_, formatSet]) => {
        const format = formatSet[formatKey];
        return format?.url && format.width
          ? `${format.url} ${format.width}w`
          : null;
      })
      .filter(Boolean)
      .join(", ");
  }
};

interface IImageProps {
  formats: TFormatsObject;
  alt: string;
  sizes?: string;
  fallbackSrc: string;
  className?: string;
  setIsLoaded?: (value: boolean) => void;
  isLoaded?: boolean;
  isBig?: boolean;
}

export const Image: FC<IImageProps> = ({
  formats,
  alt = "image",
  sizes = "(max-width: 768px) 180px, 250px",
  fallbackSrc,
  className,
  setIsLoaded,
  isLoaded,
  isBig
}) => {
  const func = isBig ? buildSrcSetForBig : buildSrcSetForSmall;
  const avifSrcSet = func(formats, "avif");
  const webpSrcSet = func(formats, "webp");
  const originSrcSet = func(formats, "origin");

  const hasSources = avifSrcSet || webpSrcSet || originSrcSet;

  const imgRef = useRef<HTMLImageElement>(null);

  const handleLoad = () => {
    setIsLoaded?.(true);
  };

  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded?.(true);
    }
  }, [setIsLoaded]);

  const imgProps: ImgHTMLAttributes<HTMLImageElement> = {
    src: replaceS3WithCDN(fallbackSrc),
    sizes,
    alt,
    onLoad: handleLoad,
    loading: "lazy",
    className: clsx(
      "object-cover w-full h-full transition-opacity duration-500",
      isLoaded ? "opacity-100" : "opacity-0"
    )
  };

  if (!hasSources) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img ref={imgRef} {...imgProps} alt={imgProps.alt} />;
  }

  return (
    <picture className={clsx("block w-full h-full", className)}>
      {avifSrcSet && (
        <source srcSet={avifSrcSet} sizes={sizes} type="image/avif" />
      )}
      {webpSrcSet && (
        <source srcSet={webpSrcSet} sizes={sizes} type="image/webp" />
      )}
      {originSrcSet && <source srcSet={originSrcSet} sizes={sizes} />}
      <img ref={imgRef} {...imgProps} alt={imgProps.alt} />
    </picture>
  );
};
