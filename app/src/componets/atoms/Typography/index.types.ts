import type { HTMLAttributes } from "react";

export type TypographyProps = HTMLAttributes<
  HTMLParagraphElement | HTMLHeadingElement
> & {
  tag?: TypographyTag;
  text?: string;
};

export type TypographyTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";
