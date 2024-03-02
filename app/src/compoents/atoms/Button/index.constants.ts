import type { Color, Position, Roundness } from "./index.types";

const commonButtonClass =
  "h-8 md:h-10 box-border rounded-9xl text-xs md:text-sm md:leading-4.5";

const colorClasses: Record<Color, string> = {
  default: "text-white bg-black border border-black" + commonButtonClass,
  second:
    "text-black border border-black border-opacity-10" + commonButtonClass,
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
  middle: "!rounded-none border-l-0 pl-0",
  end: "rounded-l-none border-l-0 pl-0",
  normal: "rounded-2sm",
  rounded: "rounded-full"
};

export { colorClasses, positionClasses, borderClasses };
