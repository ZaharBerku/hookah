"use client";

import { Label, Icon } from "@/componets/atoms";
import cx from "clsx";
import { FC, useState } from "react";

import { SelectProps } from "./index.types";

const Select: FC<SelectProps> = ({
  classes,
  label,
  helperText,
  id,
  full,
  isRequred,
  sideElements = {},
  options,
  placeholder,
  selectOption,
  onChangeSelect
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionClick = (option: any) => {
    setIsOpen(false);
    if (onChangeSelect) {
      onChangeSelect(option);
    }
  };
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
            "rounded-md relative bg-white border flex items-center focus:shadow-lg border-secondary h-12",
            classes?.containerInput,
            full ? "w-full" : "w-fit"
          )}
        >
          {left}
          <button
            onClick={toggleDropdown}
            className="text-black flex items-center justify-between w-full px-4"
          >
            <span>{selectOption ? selectOption.label : placeholder}</span>
            <Icon type="ChevronDownIcon" className="fill-secondary-base" />
          </button>
          {isOpen && (
            <ul className="absolute max-h-60 z-10 top-full w-full bg-white overflow-auto mt-1 rounded-md border border-secondary shadow">
              {options.map((option: any) => (
                <li
                  key={option.value}
                  onClick={() => handleOptionClick(option)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {option.label}
                </li>
              ))}
            </ul>
          )}
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

export { Select };
