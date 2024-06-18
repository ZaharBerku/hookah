"use client";

import { Button } from "@/compoents/atoms";
import { WrapperActionsProduct } from "@/hoc";
import { useTranslations } from "next-intl";
import { FC } from "react";

import { ProductList } from "../ProductList";

interface ProductSectionProps {
  data: any;
}

const ProductSection: FC<ProductSectionProps> = ({ data }) => {
  const t = useTranslations("Button.More");
  return (
    <div className="flex flex-col justify-center items-center w-full gap-8 md:gap-14 relative">
      {Boolean(data?.length) && (
        <WrapperActionsProduct>
          <ProductList data={data} />
        </WrapperActionsProduct>
      )}
      <Button className="md:max-w-49 w-full !h-14" color="second">
        {t("text")}
      </Button>
    </div>
  );
};

export { ProductSection };
