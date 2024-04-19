import clsx from "clsx";
import Link from "next/link";
import { Ref, forwardRef } from "react";

import {
  colorClasses,
  borderClasses,
  positionClasses,
  commonButtonClass
} from "./index.constants";
import type { ButtonProps } from "./index.types";

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      children,
      color = "default",
      rounded = "normal",
      positionText = "center",
      className,
      full = false,
      icons,
      ...props
    },
    ref
  ) => {
    const IconLeft = icons?.iconLeft;
    const IconRight = icons?.iconRight;
    const commonClassName = clsx(
      "flex cursor-pointer",
      full ? "w-full" : "w-fit",
      borderClasses[rounded],
      positionClasses[positionText],
      commonButtonClass + colorClasses[color],
      className
    );

    if (props.as === "link") {
      const { as, ...rest } = props;
      return (
        <Link
          ref={ref as Ref<HTMLAnchorElement>}
          className={commonClassName}
          {...rest}
        >
          {IconLeft && IconLeft}
          {children}
          {IconRight && IconRight}
        </Link>
      );
    }
    return (
      <button
        ref={ref as Ref<HTMLButtonElement>}
        className={commonClassName}
        {...props}
      >
        {IconLeft && IconLeft}
        {children}
        {IconRight && IconRight}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
