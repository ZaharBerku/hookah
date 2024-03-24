import { Label } from "@/compoents/atoms";
import cx from "clsx";
import { FC } from "react";

import { FieldProps } from "./index.types";

const Field: FC<FieldProps> = ({
  classes,
  label,
  helperText,
  id,
  full,
  isRequred,
  sideElements = {},
  ...props
}) => {
  const { left, right } = sideElements;
  return (
    <div className={classes?.wrapper}>
      <div
        className={cx(
          "flex flex-col w-auto gap-4 relative",
          classes?.container
        )}
      >
        {label && (
          <Label
            isRequred={isRequred}
            className={cx(classes?.label, {
              "!text-error": Boolean(helperText)
            })}
            htmlFor={id}
          >
            {label}
          </Label>
        )}
        <div
          className={cx(
            "rounded-9xl overflow-hidden px-4 bg-white border flex items-center focus:shadow-lg border-black h-12",
            classes?.containerInput,
            full ? "w-full" : "w-fit"
          )}
        >
          {left}
          <input
            id={id}
            {...props}
            className={cx(
              "text-black outline-none h-full w-full placeholder:text-base placeholder:font-light",
              props?.className
            )}
          />
          {right}
        </div>
        {helperText && (
          <span
            className={cx(
              "text-error text-xs font-light absolute top-full",
              classes?.helperText
            )}
          >
            {helperText}
          </span>
        )}
      </div>
    </div>
  );
};

export { Field };
