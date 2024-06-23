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
  const t = useTranslations();

  if (!data.length) {
    return (
      <span className="py-14 flex justify-center items-center">
        {t("Product.isNotHave")}
      </span>
    );
  }
  return (
    <div className="flex flex-col justify-center items-center w-full gap-8 md:gap-14 relative">
      {Boolean(data?.length) && (
        <WrapperActionsProduct>
          <ProductList data={data} />
        </WrapperActionsProduct>
      )}
      {/* <Button className="md:max-w-49 w-full !h-14" color="second">
        {t("Button.More.text")}
      </Button> */}
    </div>
  );
};

export { ProductSection };
