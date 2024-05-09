"use client";

import { Label } from "@/compoents/atoms";
import {
  Autocomplete as AutocompleteComponent,
  AutocompleteItem
} from "@nextui-org/autocomplete";
import cx from "clsx";
import { FC } from "react";

import { AutocompleteProps } from "./index.types";

const Autocomplete: FC<AutocompleteProps> = ({
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
              "!text-error": Boolean(helperText)
            })}
            htmlFor={id}
          >
            {label}
          </Label>
        )}
        <div
          className={cx(
            "rounded-md overflow-hidden bg-white border flex items-center focus:shadow-lg border-secondary h-12",
            classes?.containerInput,
            full ? "w-full" : "w-fit"
          )}
        >
          {left}
          <AutocompleteComponent
            id={id}
            classNames={{
              listboxWrapper: "max-h-32 md:max-h-60 overflow-auto"
            }}
            inputProps={{
              classNames: {
                inputWrapper: "h-12 px-4",
                input: "placeholder:font-light placeholder:text-base"
              },
              onClick: (event) => (event.target as HTMLInputElement)?.focus()
            }}
            popoverProps={{
              classNames: {
                base: "rounded-md",
                content: "border border-secondary rounded-md bg-background"
              }
            }}
            className={cx(
              "text-black !outline-none !h-full w-full placeholder:text-base placeholder:font-light !p-0",
              props?.className
            )}
            {...props}
          >
            {(item: any) => {
              return (
                <AutocompleteItem
                  key={item.value}
                  value={item.value}
                  className="capitalize"
                >
                  {item.label}
                </AutocompleteItem>
              );
            }}
          </AutocompleteComponent>

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

export { Autocomplete };
