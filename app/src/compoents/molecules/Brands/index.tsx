"use client";

import clsx from "clsx";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { ChangeEvent, ComponentProps, FC, useEffect, useState } from "react";

import { usePathname, useRouter } from "@/utils/navigation";
import { searchParamKeys } from "@/utils/variables";

interface BrandProps extends ComponentProps<"input"> {
  label: string;
  avatar: string;
  isCheked?: boolean;
}

interface BrandsProps {
  brands: any;
  fetchFilterProduct: (selectedBrands: string[]) => void;
}

const Brand: FC<BrandProps> = ({ isCheked, label, avatar, ...props }) => {
  return (
    <label
      className={clsx(
        "flex justify-start border-r-2 border-r-light-dark-accent w-auto active:bg-gray-200 md:hover:bg-gray-200 items-center text-base font-normal text-black cursor-pointer gap-2 px-5 py-2 border border-white border-opacity-20",
        { "bg-gray-200": isCheked }
      )}
    >
      <input className="hidden" type="checkbox" {...props} />
      <span className="h-15 w-15 relative">
        <Image fill objectFit="contain" src={avatar} alt="avatar-branda" />
      </span>
      {label}
    </label>
  );
};

const Brands: FC<BrandsProps> = ({ brands, fetchFilterProduct }) => {
  const searchParams = useSearchParams();
  const initialSelectedBrands =
    searchParams.get(searchParamKeys.brands)?.split(",") || [];
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    initialSelectedBrands
  );
  const router = useRouter();
  const pathname = usePathname();

  const getCurrentSelectedBrands = (value: string) => {
    const copyCurrentSelectedBrands = [...selectedBrands];
    if (copyCurrentSelectedBrands.includes(value)) {
      copyCurrentSelectedBrands.splice(
        copyCurrentSelectedBrands.indexOf(value),
        1
      );
    } else {
      copyCurrentSelectedBrands.push(value);
    }
    return copyCurrentSelectedBrands;
  };

  const handleChange = (event: ChangeEvent<HTMLFormElement>) => {
    const value = event.target.value;
    const currentSeletedBrands = getCurrentSelectedBrands(value);
    setSelectedBrands(currentSeletedBrands);
    fetchFilterProduct(currentSeletedBrands);
  };

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (selectedBrands.length) {
      params.set(searchParamKeys.brands, selectedBrands.join(","));
      router.push(decodeURIComponent(`${pathname}?${params.toString()}`));
    } else if (params.has(searchParamKeys.brands)) {
      params.delete(searchParamKeys.brands);
      router.push(`${pathname}`);
    }
  }, [selectedBrands, router, pathname, searchParams]);

  return (
    <div className="p-2">
      <form
        onChange={handleChange}
        className="bg-white shadow-3xl shadow-card-shadow-color rounded-3xl overflow-hidden -mr-1"
      >
        <fieldset className="grid grid-cols-auto-fill-mobile md:grid-cols-auto-fill">
          {brands.map((brand: any) => {
            const isCheked = selectedBrands.includes(brand.id);
            return (
              <Brand
                label={brand.attributes.name}
                avatar={brand.attributes.logo.data.attributes.url}
                key={brand.id}
                isCheked={isCheked}
                value={brand.id}
                name={"brands"}
              />
            );
          })}
        </fieldset>
      </form>
    </div>
  );
};

export { Brands };
