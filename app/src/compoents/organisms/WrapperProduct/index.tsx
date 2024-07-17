"use client";

import { DescriptionProduct } from "@/compoents/atoms";
import { ProductActionsStickyBar } from "@/compoents/organisms";
import { FC, PropsWithChildren } from "react";

interface WrapperProductProps extends PropsWithChildren {
  data: any;
  loading?: boolean;
}

const WrapperProduct: FC<WrapperProductProps> = ({ data, children }) => {
  const { attributes, id } = data || {};

  return (
    <div className="flex flex-col gap-16">
      {children}
      <DescriptionProduct
        text={attributes.descriptions}
        className="block md:hidden"
      />
      <ProductActionsStickyBar
        id={id}
        odId={attributes.odId}
        likes={attributes.likes}
        data={attributes}
        numberOf={attributes.numberOf}
      />
    </div>
  );
};

export { WrapperProduct };
