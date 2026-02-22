"use client";

import { Filter, StickyFilterBar } from "@/componets/organisms";
import { FC, PropsWithChildren } from "react";

interface WrapperProductWithFilterProps extends PropsWithChildren {
  defaultPageFilter?: string;
  fetchFilterProduct: any;
}

const WrapperProductWithFilter: FC<WrapperProductWithFilterProps> = ({
  children,
  defaultPageFilter,
  fetchFilterProduct
}) => {
  return (
    <div className="flex flex-col md:flex-row relative">
      <Filter
        fetchFilterProduct={fetchFilterProduct}
        defaultPageFilter={defaultPageFilter}
        isDesktopFilter
      />
      <StickyFilterBar
        fetchFilterProduct={fetchFilterProduct}
        defaultPageFilter={defaultPageFilter}
      />
      <div className="block md:hidden w-full max-w-74"></div>
      {children}
    </div>
  );
};

export { WrapperProductWithFilter };
