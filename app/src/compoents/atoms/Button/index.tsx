import clsx from "clsx";
import type { FC } from "react";

import {
  colorClasses,
  borderClasses,
  positionClasses,
  commonButtonClass
} from "./index.constants";
import type { ButtonProps } from "./index.types";

const Button: FC<ButtonProps> = ({
  children,
  color = "default",
  rounded = "normal",
  positionText = "center",
  className,
  full = false,
  icons,
  ...props
}) => {
  const IconLeft = icons?.iconLeft;
  const IconRight = icons?.iconRight;
  return (
    <button
      className={clsx(
        "flex cursor-pointer",
        full ? "w-full" : "w-fit",
        borderClasses[rounded],
        positionClasses[positionText],
        commonButtonClass + colorClasses[color],
        className
      )}
      {...props}
    >
      {IconLeft && IconLeft}
      {children}
      {IconRight && IconRight}
    </button>
  );
};

export { Button };
