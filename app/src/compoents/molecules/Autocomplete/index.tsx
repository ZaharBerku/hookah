"use client";

import { Label, Icon } from "@/compoents/atoms";
import cx from "clsx";
import { ChangeEvent, FC, useEffect, useRef, useState } from "react";

import { OptionsType } from "@/utils/types";

import { AutocompleteProps } from "./index.types";

const Autocomplete: FC<AutocompleteProps> = ({
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
  ...props
}) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [isRenderTop, setIsRenderTop] = useState(false);
  const [value, setValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { left, right } = sideElements;

  const handleOpenList = () => {
    setIsOpen(true);
  };

  const handleCloseList = () => {
    setIsOpen(false);
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
    setCurrentValue && setCurrentValue(value);
    if (onChange) {
      onChange(event);
    }
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
              { "border-accent-content": helperText }
            )}
          >
            {left}
            <input
              id={id}
              {...props}
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
                  isRenderTop ? "bottom-full" : "top-full"
                )}
              >
                {isLoading ? (
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    <Icon type="SpinnerIcon" className="w-5 h-5" />
                  </li>
                ) : options?.length ? (
                  options?.map((option) => {
                    return (
                      <li
                        key={option.value}
                        onClick={() => handleClick(option)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {option.label}
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

            {right ? (
              right
            ) : (
              <Icon type="ChevronDownIcon" className="fill-secondary w-4 h-4" />
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
};

export { Autocomplete };
