"use client";

import { Button } from "@/compoents/atoms";
import { WrapperActionsProduct } from "@/hoc";
import { FC } from "react";

import { ProductList } from "../ProductList";

interface ProductSectionProps {
  data: any;
}

const ProductSection: FC<ProductSectionProps> = ({ data }) => {
  return (
    <div className="flex flex-col w-full gap-8 md:gap-14 relative">
      {Boolean(data?.length) && (
        <WrapperActionsProduct>
          <ProductList data={data} />
        </WrapperActionsProduct>
      )}
      <Button
        className="md:max-w-49 w-full self-end !h-12 md:!h-10"
        color="second"
      >
        Дивитись всі
      </Button>
    </div>
  );
};

export { ProductSection };
