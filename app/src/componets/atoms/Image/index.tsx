"use client";

import clsx from "clsx";
import { type FC, useRef } from "react";

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
          ? `${format.url} ${format.width}w`
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
  const { large, medium } = formats || {};
  if (medium && large) {
    return Object.entries({ large, medium })
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
  const imgRef = useRef<HTMLImageElement>(null);
  const func = isBig ? buildSrcSetForBig : buildSrcSetForSmall;
  const avifSrcSet = func(formats, "avif");
  const webpSrcSet = func(formats, "webp");
  const originSrcSet = func(formats, "origin");

  const hasSources = avifSrcSet || webpSrcSet || originSrcSet;

  const handleLoad = () => {
    setIsLoaded?.(true);
  };

  const imgProps = {
    ref: imgRef,
    src: fallbackSrc,
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
    return <img {...imgProps} />;
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
      <img {...imgProps} />
    </picture>
  );
};
