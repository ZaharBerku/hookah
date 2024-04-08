import type { ComponentProps, ReactNode } from "react";

export type ButtonProps = ComponentProps<"button"> & {
  color?: Color;
  rounded?: Roundness;
  full?: boolean;
  positionText?: Position;
  sizeButton?: Size;
  icons?: {
    iconLeft?: ReactNode,
    iconRight?: ReactNode,
  };
};

export type Color = "default" | "second" | "accent" | "transparent";
export type Size = "xs" | "sm" | "md" | "lg" | "xl" | "none";

export type Position =
  | `${"top" | "bottom"}-${"left" | "center" | "right"}`
  | `center${"" | "-left" | "-right"}`;

export type Roundness = "start" | "middle" | "end" | "normal" | "rounded" | "none";
