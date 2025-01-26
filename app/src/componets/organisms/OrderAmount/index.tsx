"use client";

import { Button, Typography } from "@/componets/atoms";
import { PromocodeField } from "@/componets/organisms";
import { observer } from "mobx-react-lite";
import { useTranslations } from "next-intl";
import { FC, PropsWithChildren } from "react";

import { useStores } from "@/hooks";

interface OrderAmountProps extends PropsWithChildren {
  title: string;
  handleCheckout: () => void;
  textButton: string;
}

const OrderAmount: FC<OrderAmountProps> = observer(
  ({ children, title, handleCheckout, textButton }) => {
    const { cart } = useStores();
    const t = useTranslations("OrderAmount");
    const { amount, amountWithDiscount } = cart;
    const discount = Math.floor(amount - amountWithDiscount);
    if (!Object.keys(cart?.selectedProducts)?.length) {
      return null;
    }

    return (
      <div className="px-6 py-5 border-black border w-full border-opacity-10 flex flex-col gap-6 justify-between rounded-3xl flex-[40%]">
        <Typography tag="h3" text={title} />
        {children}
        <ul className="flex flex-col w-full gap-5 border-b border-black border-opacity-10 pb-5">
          <li className="flex justify-between items-center">
            <span className="text-3xs text-black text-opacity-60">
              {t("labels.totalPrice")}
            </span>
            <span className="text-3xs font-bold text-black">₴{amount}</span>
          </li>
          {Boolean(discount) && (
            <li className="flex justify-between items-center">
              <span className="text-3xs text-black text-opacity-60">
                {t("labels.discount")}
              </span>
              <span className="text-3xs font-bold text-accent-content">
                -₴{discount}
              </span>
            </li>
          )}
          <li className="flex justify-between items-center">
            <span className="text-3xs text-black text-opacity-60">
              {t("labels.deliveryCost")}
            </span>
            <span className="text-3xs font-bold text-black">
              {t("labels.deliveryByTariff")}
            </span>
          </li>
        </ul>
        <PromocodeField />
        <div className="flex justify-between items-center">
          <span className="text-lg">{t("labels.totalSum")}</span>
          <span className=" text-xl font-bold text-black">
            ₴{amountWithDiscount}
          </span>
        </div>
        <Button
          className={"!min-h-11 md:!min-h-12"}
          type="button"
          onClick={handleCheckout}
          full
        >
          {textButton}
        </Button>
      </div>
    );
  }
);

export default OrderAmount;
