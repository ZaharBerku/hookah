import clsx from "clsx";
import { Ref, forwardRef } from "react";

import { Link } from "@/utils/navigation";

import {
  colorClasses,
  borderClasses,
  positionClasses
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
      colorClasses[color] +
        "box-border font-normal rounded-lg text-3xs md:leading-4.5 disabled:bg-primary-base disabled:hover:bg-primary-base disabled:text-white disabled:active:bg-primary-base disabled:!border-primary-base",
      className
    );
    if (props.as === "link") {
      const { as, disabled, ...rest } = props;
      return (
        <Link
          ref={ref as Ref<HTMLAnchorElement>}
          className={clsx(commonClassName, "h-11 md:h-12 bg-gda", {
            "pointer-events-none": Boolean(disabled)
          })}
          {...rest}
          scroll={false}
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
        className={clsx(commonClassName, "h-11 md:h-12")}
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
