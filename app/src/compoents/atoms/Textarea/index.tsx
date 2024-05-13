import { Label } from "@/compoents/atoms";
import cx from "clsx";
import { FC } from "react";

import { TextareaProps } from "./index.types";

const Textarea: FC<TextareaProps> = ({
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
          "flex flex-col w-auto gap-4 relative pb-2",
          classes?.container
        )}
      >
        {label && (
          <Label
            isRequred={isRequred}
            className={cx(classes?.label, {
              "!text-accent-content": Boolean(helperText),
            })}
            htmlFor={id}
          >
            {label}
          </Label>
        )}
        <textarea
          id={id}
          {...props}
          className={cx(
            "text-black resize-none outline-none px-4 rounded-4xl border focus:shadow-lg border-black disabled:border-borderColor h-12 placeholder:text-sm placeholder:font-light placeholder:text-seconderyGray",
            props?.className,
            full ? "w-full" : "w-fit"
          )}
        />
        {helperText && (
          <span
            className={cx(
              "text-accent-content text-xs font-light absolute top-full",
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

export { Textarea };
