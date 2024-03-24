import type { Color, Position, Roundness } from "./index.types";

const commonButtonClass =
  "h-8 md:h-10 box-border font-normal rounded-9xl text-xs md:text-sm md:leading-4.5 ";

const colorClasses: Record<Color, string> = {
  default:
    commonButtonClass +
    "text-white bg-black border border-black hover:bg-primary-base hover:border-primary-base active:text-primary-base active:bg-white",
  second:
    commonButtonClass +
    "text-black bg-white border border-primary-base hover:bg-black hover:border-black hover:text-white active:bg-primary-base active:border-primary-base",
  accent: commonButtonClass + "text-white bg-primary text-sm md:text-base hover:bg-primary-hover",
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
  rounded: "rounded-full"
};

export { colorClasses, positionClasses, borderClasses };
