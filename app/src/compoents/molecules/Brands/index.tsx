"use client";

import clsx from "clsx";
import { useFormik } from "formik";
import Image from "next/image";
import { ComponentProps, FC } from "react";

interface BrandProps extends ComponentProps<"input"> {
  label: string;
  avatar: string;
  isCheked?: boolean;
}

interface BrandsProps {
  brands: any;
}

const Brand: FC<BrandProps> = ({ isCheked, label, avatar, ...props }) => {
  return (
    <label
      className={clsx(
        "flex border-r-2 border-r-light-dark-accent w-auto active:text-white md:hover:text-white active:bg-primary md:hover:bg-primary items-center text-base font-normal text-black cursor-pointer gap-2 px-5 py-2 border border-white border-opacity-20",
        { "bg-primary text-white": isCheked }
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

const Brands: FC<BrandsProps> = ({ brands }) => {
  const handleSubmit = () => {};
  const formik = useFormik<{ brands: string[] }>({
    initialValues: {
      brands: []
    },
    onSubmit: handleSubmit
  });
  return (
    <form
      className="bg-white shadow-3xl shadow-card-shadow-color rounded-3xl overflow-hidden -mr-1"
      onSubmit={formik.handleSubmit}
    >
      <fieldset className="grid grid-cols-auto-fill -mr-2">
        {brands.map((brand: any) => {
          const isCheked = formik.values.brands.includes(brand.id);
          return (
            <Brand
              label={brand.label}
              avatar={brand.avatar}
              key={brand.id}
              isCheked={isCheked}
              value={brand.id}
              name={"brands"}
              checked={isCheked}
              onChange={formik.handleChange}
            />
          );
        })}
      </fieldset>
    </form>
  );
};

export { Brands };
