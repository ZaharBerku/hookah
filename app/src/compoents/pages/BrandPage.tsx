"use client";

import { Typography } from "@/compoents/atoms";
import { ProductSection, WrapperWithBreadcrumb } from "@/compoents/organisms";
import { FC } from "react";

interface BrandPageProps {
  data: any;
  loading: boolean;
  label: string;
  slugBrand: string;
}

const BrandPage: FC<BrandPageProps> = ({ data, label, loading, slugBrand }) => {
  if (loading) {
    return null;
  }

  return (
    <WrapperWithBreadcrumb
      getDefaultTextGenerator={(subpath) =>
        subpath === slugBrand ? label : subpath
      }
    >
      <section className="relative flex flex-col gap-4 w-full">
        <Typography
          className="text-xl text-black font-bold"
          tag="h2"
          text={label}
        />
        <ProductSection data={data} />
      </section>
    </WrapperWithBreadcrumb>
  );
};

export { BrandPage };
