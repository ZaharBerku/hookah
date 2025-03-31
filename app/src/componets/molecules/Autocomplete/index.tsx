"use client";

import { Label, Icon, Button } from "@/componets/atoms";
import cx from "clsx";
import Image from "next/image";
import { ChangeEvent, forwardRef, useEffect, useRef, useState } from "react";

import { OptionsType } from "@/utils/types";

import { Price } from "../Price";
import { AutocompleteProps } from "./index.types";

const Autocomplete = forwardRef<HTMLInputElement, AutocompleteProps>(
  (
    {
      classes,
      label,
      helperText,
      id,
      full,
      isRequred,
      sideElements = {},
      options,
      handleOptionClick,
      onChange,
      isLoading,
      currentValue,
      setCurrentValue,
      open,
      setOpen,
      ...props
    },
    ref
  ) => {
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const [isRenderTop, setIsRenderTop] = useState(false);
    const [value, setValue] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const { left, right } = sideElements;

    const handleOpenList = () => {
      setIsOpen(true);
      setOpen?.(true);
    };

    const handleCloseList = () => {
      setIsOpen(false);
      setOpen?.(false);
    };

    const handleCloseOnBlur = () => {
      handleCloseList();
      const hasOption = options.some((option) => option.label === value);
      if (!hasOption) {
        setValue("");
      }
    };

    const handleClick = (option: OptionsType) => {
      if (handleOptionClick) {
        handleOptionClick(option);
      }
      setValue(option.label);
      handleCloseList();
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setValue(value);
      setCurrentValue?.(value);
      if (onChange) {
        onChange(event);
      }
    };

    const handleResetValue = () => {
      setValue("");
      setCurrentValue?.("");
      handleCloseList();
    };

    const updatePosition = () => {
      if (!wrapperRef.current) return;
      const rect = wrapperRef.current?.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const neededSpace = 250;

      setIsRenderTop(spaceBelow < neededSpace);
    };

    useEffect(() => {
      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition, true);
      return () => {
        window.removeEventListener("resize", updatePosition);
        window.removeEventListener("scroll", updatePosition, true);
      };
    }, []);

    useEffect(() => {
      setValue(currentValue || "");
    }, [currentValue]);

    useEffect(() => {
      setIsOpen(Boolean(open));
    }, [open]);

    return (
      <>
        {isOpen && (
          <div
            className="fixed h-full w-full inset-0 z-10"
            onClick={handleCloseOnBlur}
          ></div>
        )}
        <div
          onClick={(event) => event.stopPropagation()}
          ref={wrapperRef}
          className={cx(
            "relative ",
            classes?.wrapper,
            full ? "w-full" : "w-fit",
            { "z-20": isOpen }
          )}
        >
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
                "rounded-md bg-white border px-4 relative flex items-center focus:shadow-lg border-secondary h-12",
                classes?.containerInput,
                full ? "w-full" : "w-fit",
                { "!border-accent-content": helperText }
              )}
            >
              {left}
              <input
                id={id}
                {...props}
                ref={ref}
                value={value}
                onChange={handleChange}
                onFocus={handleOpenList}
                className={cx(
                  "text-black outline-none h-full w-full placeholder:text-base placeholder:font-light",
                  props?.className
                )}
              />
              {isOpen && (
                <ul
                  className={cx(
                    "absolute max-h-60 left-0 z-10 w-full bg-white overflow-auto my-1 rounded-md border border-secondary shadow",
                    isRenderTop ? "bottom-full" : "top-full",
                    classes?.list
                  )}
                >
                  {isLoading ? (
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      <Icon
                        type="SpinnerIcon"
                        className="w-5 h-5 animate-spin"
                      />
                    </li>
                  ) : options?.length ? (
                    options?.map((option) => {
                      return (
                        <li
                          key={option.value}
                          onClick={() => handleClick(option)}
                          className="px-4 py-2 flex gap-1 items-center text-sm md:text-base hover:bg-gray-100 cursor-pointer"
                        >
                          {option.image && option.alt && (
                            <div className="min-w-12 h-12 relative">
                              <Image
                                fill
                                src={option.image}
                                unoptimized
                                loading="lazy"
                                alt={option.alt}
                              />
                            </div>
                          )}
                          <span className="flex flex-col">
                            {option.label}
                            {option.price !== undefined &&
                              option.discount !== undefined && (
                                <Price
                                  price={option.price}
                                  discount={option.discount}
                                  className="!text-lg"
                                />
                              )}
                          </span>
                        </li>
                      );
                    })
                  ) : (
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      Нічого не знайдено
                    </li>
                  )}
                </ul>
              )}
              {value && (
                <Button
                  className="!h-5 !w-5"
                  color="transparent"
                  onClick={handleResetValue}
                >
                  <Icon type="CloseIcon" className="fill-black w-5 h-5" />
                </Button>
              )}
              {right ? (
                right
              ) : (
                <Icon
                  type="ChevronDownIcon"
                  className="fill-secondary w-4 h-4"
                />
              )}
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
      </>
    );
  }
);

Autocomplete.displayName = "Autocomplete";
export { Autocomplete };
