import type { ComponentProps } from "react";

export type ButtonProps = ComponentProps<"button"> & {
  color?: Color;
  rounded?: Roundness;
  full?: boolean;
  positionText?: Position;
  sizeButton?: Size;
};

export type Color = "main" | "secondary" | "transparent";
export type Size = "xs" | "sm" | "md" | "lg" | "xl" | "none";

export type Position =
  | `${"top" | "bottom"}-${"left" | "center" | "right"}`
  | `center${"" | "-left" | "-right"}`;

export type Roundness = "start" | "middle" | "end" | "normal" | "rounded";
