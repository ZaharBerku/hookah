import clsx from "clsx";
import { Ref, forwardRef } from "react";

import { Link } from "@/utils/navigation";

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
      colorClasses[color] + commonButtonClass,
      className
    );
    if (props.as === "link") {
      const { as, disabled, ...rest } = props;
      return (
        <Link
          ref={ref as Ref<HTMLAnchorElement>}
          className={clsx(commonClassName, { "pointer-events-none": Boolean(disabled) })}
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
        suppressHydrationWarning
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
