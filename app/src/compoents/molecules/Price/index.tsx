import { FC } from "react";

import { calculeteAmountWithDiscount } from "@/utils/helpers";

interface PriceProps {
  price: number;
  discount: number;
}

const Price: FC<PriceProps> = ({ price, discount }) => {
  const priceWithDiscount = calculeteAmountWithDiscount(price, discount);

  return (
    <div className="flex items-center gap-3 md:gap-4">
      <span className="text-base-xl">₴{priceWithDiscount}</span>
      {Boolean(discount) && (
        <>
          <span className="text-lg text-secondary-base line-through">
            ₴{price}
          </span>
          <span className="text-[8px] md:text-xs text-accent-content rounded-3xl py-1.5 px-2.5 md:px-3.5 bg-secondary-content">
            -{discount}%
          </span>
        </>
      )}
    </div>
  );
};

export { Price };
