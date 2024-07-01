"use client";

import { Icon, Typography } from "@/compoents/atoms";
import { Brands } from "@/compoents/molecules";
import { ProductSection, WrapperWithBreadcrumb } from "@/compoents/organisms";
import { FILTER_PRODUCTS_QUERY } from "@/query/schema";
import { useLazyQuery } from "@apollo/client";
import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { FC, useEffect, useRef, useState, Suspense } from "react";

import { locales } from "@/utils/navigation";

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
