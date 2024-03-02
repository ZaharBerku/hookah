import clsx from "clsx";
import type { FC } from "react";

import {
  colorClasses,
  borderClasses,
  positionClasses
} from "./index.constants";
import type { ButtonProps } from "./index.types";

const Button: FC<ButtonProps> = ({
  children,
  color = "default",
  rounded = "normal",
  positionText = "center",
  className,
  full = false,
  ...props
}) => {
  return (
    <button
      className={clsx(
        "flex cursor-pointer ",
        full ? "w-full" : "w-fit",
        borderClasses[rounded],
        positionClasses[positionText],
        colorClasses[color],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export { Button };
