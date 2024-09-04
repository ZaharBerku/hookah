"use client";

import { Filter, StickyFilterBar } from "@/compoents/organisms";
import { FC, PropsWithChildren } from "react";

interface WrapperProductWithFilterProps extends PropsWithChildren {
  defaultPageFitler?: string;
  fetchFilterProduct: any;
}

const WrapperProductWithFilter: FC<WrapperProductWithFilterProps> = ({
  children,
  defaultPageFitler,
  fetchFilterProduct
}) => {
  return (
    <div className="flex flex-col md:flex-row relative">
      <Filter
        fetchFilterProduct={fetchFilterProduct}
        defaultPageFitler={defaultPageFitler}
      />
      <StickyFilterBar
        fetchFilterProduct={fetchFilterProduct}
        defaultPageFitler={defaultPageFitler}
      />
      <div className="block md:hidden w-full max-w-74"></div>
      {children}
    </div>
  );
};

export { WrapperProductWithFilter };
