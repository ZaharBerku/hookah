"use client";

import { Label } from "@/compoents/atoms";
import {
  Autocomplete as AutocompleteComponent,
  AutocompleteItem
} from "@nextui-org/autocomplete";
import { useInfiniteScroll } from "@nextui-org/use-infinite-scroll";
import { useAsyncList } from "@react-stately/data";
import axios from "axios";
import cx from "clsx";
import { useLocale } from "next-intl";
import { FC, useState } from "react";

// import { env } from "@/utils/config";
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
  const [options, setOptions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const currentLocation = useLocale();
  const [isLoading, setLoading] = useState(false);
  const { left, right } = sideElements;

  const list = useAsyncList<any>({
    async load({ filterText }) {
      const { data } = await axios.get("/api/novaposhta", {
        params: {
          cityName: filterText,
          location: currentLocation
        }
      });
      return {
        items: data.data
      };
    }
  });

  const handleChange = () => {};

  const onLoadMore = async () => {
    setLoading(true);

    setLoading(false);
  };
  const [, scrollerRef] = useInfiniteScroll({
    isEnabled: isOpen,
    shouldUseLoader: false,
    onLoadMore
  });
  console.log(list.items, "list.items");
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
            scrollRef={scrollerRef}
            inputValue={list.filterText}
            isLoading={list.isLoading}
            items={list.items}
            classNames={{
              listboxWrapper: "max-h-[220px] overflow-auto"
            }}
            onChange={handleChange}
            onInputChange={list.setFilterText}
            inputProps={{
              classNames: {
                inputWrapper: "h-12 px-4",
                input: "placeholder:font-light placeholder:text-base"
              }
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
                  key={item.Ref}
                  value={item.Ref}
                  className="capitalize"
                >
                  {item.Description}
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
