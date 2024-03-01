import type includedIcons from "@assets/icons";

export type IconType = keyof typeof includedIcons;

export type IconProps = {
  type: IconType;
  className?: string;
  onClick?: () => void;
  height?: string;
  width?: string;
  fill?: string;
  opacity?: string;
};
