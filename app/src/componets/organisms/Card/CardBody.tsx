import { Typography } from "@/componets/atoms";
import { Price } from "@/componets/molecules";
import { FC } from "react";

import { CardType } from "./index";

interface CardPropsBody
  extends Pick<CardType, "discount" | "price" | "name" | "colors"> {}

const CardBody: FC<CardPropsBody> = ({ name, discount, price, colors }) => {
  return (
    <div className="w-full flex flex-col gap-2 md:gap-4 flex-1 justify-between">
      <Typography className="truncate text-start" tag="h5" text={name} />
      <Price discount={discount} price={price} />
    </div>
  );
};

export { CardBody };
