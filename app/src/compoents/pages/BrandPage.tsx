"use client";

import { Typography } from "@/compoents/atoms";
import { ProductSection, WrapperWithBreadcrumb } from "@/compoents/organisms";
import { FC } from "react";

interface ProductsPageProps {
  data: any;
  loading: boolean;
  label: string;
}

const BrandPage: FC<ProductsPageProps> = ({ data, label, loading }) => {
  if (loading) {
    return null;
  }

  const currentLabel = label.slice(0, 1).toLocaleUpperCase() + label.slice(1);

  return (
    <WrapperWithBreadcrumb
      getDefaultTextGenerator={(subpath) =>
        subpath === label ? currentLabel : subpath
      }
    >
      <section className="relative flex flex-col gap-4 w-full">
        <Typography
          className="text-xl text-black font-bold"
          tag="h2"
          text={currentLabel}
        />
        <ProductSection data={data} />
      </section>
    </WrapperWithBreadcrumb>
  );
};

export { BrandPage };
