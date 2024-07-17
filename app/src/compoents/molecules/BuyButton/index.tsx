"use client";

import { Button } from "@/compoents/atoms";
import { useTranslations } from "next-intl";
import { FC, MouseEvent } from "react";
import toast from "react-hot-toast";

import { useStores } from "@/hooks";
import { modalNames } from "@/utils/variables";

interface BuyButtonProps {
  data: any;
  id: string;
  full?: boolean;
}

const BuyButton: FC<BuyButtonProps> = ({ data, id, full = true }) => {
  const {
    cart: { addProductToCart },
    modal
  } = useStores();

  const t = useTranslations("Button.Buy");
  const handleClickBuy = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    toast.success("Продукт був успішно доданий до корзини");
    addProductToCart({
      id,
      attributes: {
        compositeId: data.compositeId,
        discount: data.discount,
        price: data.price,
        odId: data.odId,
        name: data.name,
        numberOf: data.numberOf
      }
    });
    modal.openModal(modalNames.ModalProductAddToCart);
  };
  return (
    <Button onClick={handleClickBuy} full={full}>
      {t("text")}
    </Button>
  );
};

export { BuyButton };
