import { LinkProps } from "next/link";
import type {
  ReactNode,
  ButtonHTMLAttributes,
  AnchorHTMLAttributes
} from "react";

export type TypeTagButton = "a" | "button";

type CommonProps = {
  color?: Color;
  rounded?: Roundness;
  full?: boolean;
  positionText?: Position;
  icons?: {
    iconLeft?: ReactNode;
    iconRight?: ReactNode;
  };
};

type LinkComponentProps = CommonProps &
  (AnchorHTMLAttributes<HTMLAnchorElement> &
    LinkProps & {
      as: "link";
    });

type ButtonComponentProps = CommonProps &
  (ButtonHTMLAttributes<HTMLButtonElement> & {
    as?: "button";
  });

export type ButtonProps = ButtonComponentProps | LinkComponentProps;

export type Color = "default" | "second" | "accent" | "transparent";
export type Size = "xs" | "sm" | "md" | "lg" | "xl" | "none";

export type Position =
  | `${"top" | "bottom"}-${"left" | "center" | "right"}`
  | `center${"" | "-left" | "-right"}`;

export type Roundness =
  | "start"
  | "middle"
  | "end"
  | "normal"
  | "rounded"
  | "none";
