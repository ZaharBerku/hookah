import type { Color, Position, Roundness } from "./index.types";

export const commonButtonClass =
  "h-9 md:h-10 box-border font-normal rounded-9xl text-3xs md:leading-4.5 ";

const colorClasses: Record<Color, string> = {
  default:
    "text-white bg-black border border-black md:hover:bg-primary-base md:hover:border-primary-base active:text-primary-base active:bg-white",
  second:
    "text-black bg-white border border-primary-base md:hover:bg-black hover:border-black md:hover:text-white active:bg-primary-base active:border-primary-base",
  accent: "text-white bg-primary text-sm md:text-base md:hover:bg-primary-hover",
  transparent: "bg-transparent border-none"
};

const positionClasses: Record<Position, string> = {
  "top-left": "items-start justify-start",
  "top-center": "items-start justify-center",
  "top-right": "items-start justify-end",
  "center-left": "items-center justify-start",
  center: "items-center justify-center",
  "center-right": "items-center justify-end",
  "bottom-right": "items-end justify-end",
  "bottom-center": "items-end justify-center",
  "bottom-left": "items-end justify-start"
};

const borderClasses: Record<Roundness, string> = {
  start: "rounded-r-none",
  middle: "!rounded-none",
  end: "rounded-l-none",
  normal: "rounded-2sm",
  rounded: "rounded-full",
  none: "rounded-none"
};

export { colorClasses, positionClasses, borderClasses };
