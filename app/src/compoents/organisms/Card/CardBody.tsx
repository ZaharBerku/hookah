import { Typography } from "@/compoents/atoms";
import { FC } from "react";

import { CardProps } from "./index";

interface CardPropsBody
  extends Pick<CardProps, "discount" | "price" | "name"> {}

const CardBody: FC<CardPropsBody> = ({ name, discount, price }) => {
  const priceWithDiscount = discount ? price - price * (discount / 100) : price;
  return (
    <div className="w-full flex flex-col gap-2 md:gap-4">
      <Typography className="truncate" tag="h5" text={name} />
      <div className="flex items-center gap-3 md:gap-4">
        <span className="text-lg">₴{priceWithDiscount}</span>
        <span className="text-lg text-secondary-base line-through">₴{price}</span>
        <span className=" text-[8px] md:text-xs text-accent-content rounded-3xl py-1.5 px-2.5 md:px-3.5 bg-secondary-content">-{discount}%</span>
      </div>
    </div>
  );
};

export { CardBody };
