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
  ...props
}) => {
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
        <input
          id={id}
          {...props}
          className={cx(
            "text-black outline-none px-4 rounded-4xl border focus:shadow-lg border-black disabled:border-borderColor h-12 placeholder:text-sm placeholder:font-light placeholder:text-seconderyGray",
            props?.className,
            full ? "w-full" : "w-fit"
          )}
        />
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
