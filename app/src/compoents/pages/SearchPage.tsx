"use client";

import { Typography } from "@/compoents/atoms";
import { ProductSection, WrapperWithBreadcrumb } from "@/compoents/organisms";
import { FC } from "react";

interface SearchPageProps {
  data: any;
  loading: boolean;
  label: string;
  brands: any;
}

const SearchPage: FC<SearchPageProps> = ({ data, label, loading }) => {
  if (loading) {
    return null;
  }
  return (
    <WrapperWithBreadcrumb>
      <section className="relative flex flex-col gap-4 w-full">
        <Typography
          className="text-xl text-black font-bold"
          tag="h1"
          text={label}
        />
        <ProductSection data={data} />
      </section>
    </WrapperWithBreadcrumb>
  );
};

export { SearchPage };
