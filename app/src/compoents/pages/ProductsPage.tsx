"use client";

import { Typography } from "@/compoents/atoms";
import { Brands } from "@/compoents/molecules";
import { ProductSection, WrapperWithBreadcrumb } from "@/compoents/organisms";
import { FC } from "react";

interface ProductsPageProps {
  data: any;
  loading: boolean;
  label: string;
  brands: any;
}

const ProductsPage: FC<ProductsPageProps> = ({
  data,
  label,
  loading,
  brands
}) => {
  if (loading) {
    return null;
  }
  return (
    <WrapperWithBreadcrumb>
      <section className="relative flex flex-col gap-4 w-full">
        <Typography
          className="text-xl text-black font-bold"
          tag="h2"
          text={label}
        />
        <Brands brands={brands} />
        <ProductSection data={data} />
      </section>
    </WrapperWithBreadcrumb>
  );
};

export { ProductsPage };
