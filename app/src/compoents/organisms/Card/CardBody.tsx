import { Typography } from "@/compoents/atoms";
import { ColorsSlider, Price } from "@/compoents/molecules";
import { FC } from "react";

import { CardType } from "./index";

interface CardPropsBody
  extends Pick<CardType, "discount" | "price" | "name" | "colors"> {}

const CardBody: FC<CardPropsBody> = ({ name, discount, price, colors }) => {
  return (
    <div className="w-full flex flex-col gap-2 md:gap-4 flex-1 justify-between">
      <Typography className="truncate text-start" tag="h5" text={name} />
      {Boolean(colors?.length) && (
        <ColorsSlider disabled={true} colors={colors} />
      )}
      <Price discount={discount} price={price} />
    </div>
  );
};

export { CardBody };
