"use client";

import { Button, Icon } from "@/compoents/atoms";
import { WrapperActionsProduct } from "@/hoc";
import { useTranslations } from "next-intl";
import { FC, useState } from "react";

import { ProductList } from "../ProductList";

interface ProductSectionProps {
  data: any;
  fetchPaginationProduct?: () => Promise<void>;
  paginationData?: any;
}

interface ButtonMoreProps {
  fetchPaginationProduct: () => Promise<void>;
}

const ButtonMore: FC<ButtonMoreProps> = ({ fetchPaginationProduct }) => {
  const [isLoadingPaginationProducts, setIsLoadingPaginationProducts] =
    useState(false);
  const t = useTranslations();
  const handleClickMore = async () => {
    setIsLoadingPaginationProducts(true);
    await fetchPaginationProduct();
    setIsLoadingPaginationProducts(false);
  };

  if (isLoadingPaginationProducts) {
    return (
      <div className="flex justify-center items-center py-4">
        <Icon type="SpinnerIcon" className="w-20 h-20" />
      </div>
    );
  }

  return (
    <Button
      onClick={handleClickMore}
      className="md:max-w-49 w-full !h-14"
      color="second"
    >
      {t("Button.More.text")}
    </Button>
  );
};

const ProductSection: FC<ProductSectionProps> = ({
  data,
  fetchPaginationProduct,
  paginationData
}) => {
  const t = useTranslations();
  if (!data?.length) {
    return (
      <div className="py-14 flex justify-center items-center w-full">
        <span className="text-center">{t("Product.isNotHave")}</span>
      </div>
    );
  }
  return (
    <div className="flex flex-col justify-start items-center w-full gap-8 md:gap-14 relative">
      {Boolean(data?.length) && (
        <WrapperActionsProduct>
          <ProductList data={data} />
        </WrapperActionsProduct>
      )}
      {paginationData?.page !== paginationData?.pageCount &&
        fetchPaginationProduct && (
          <ButtonMore fetchPaginationProduct={fetchPaginationProduct} />
        )}
    </div>
  );
};

export { ProductSection };
