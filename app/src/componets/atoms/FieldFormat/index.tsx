import { Label } from "@/componets/atoms";
import cx from "clsx";
import { FC } from "react";
import { PatternFormat } from "react-number-format";

import { FieldFormatProps } from "./index.types";

const FieldFormat: FC<FieldFormatProps> = ({
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
    <div className={cx(classes?.wrapper, full ? "w-full" : "w-fit")}>
      <div
        className={cx(
          "flex flex-col w-auto gap-2 relative",
          full ? "w-full" : "w-fit",
          classes?.container
        )}
      >
        {label && (
          <Label
            isRequred={isRequred}
            className={cx(classes?.label, {
              "!text-accent-content": Boolean(helperText)
            })}
            htmlFor={id}
          >
            {label}
          </Label>
        )}
        <div
          className={cx(
            "rounded-md overflow-hidden px-4 bg-white border flex items-center focus:shadow-lg border-secondary h-12",
            classes?.containerInput,
            full ? "w-full" : "w-fit",
            { "border-accent-content": helperText }
          )}
        >
          {left}
          <PatternFormat
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

export { FieldFormat };
