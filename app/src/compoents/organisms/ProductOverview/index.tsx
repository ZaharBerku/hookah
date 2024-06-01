import { Typography } from "@/compoents/atoms";
import { ProductAvailability, Colors, Price } from "@/compoents/molecules";
import { ProductActions, RangesTaste } from "@/compoents/organisms";
import { FC } from "react";

interface ProductOverviewProps {
  data: any;
  id: string;
}

const ProductOverview: FC<ProductOverviewProps> = ({ data, id }) => {
  const {
    name,
    descriptions,
    colors,
    available,
    tasteChart,
    likes,
    price,
    discount
  } = data;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col w-full gap-4 pb-6 border-b border-b-black border-opacity-10">
        <Typography tag="h1" text={name} />
        <ProductAvailability available={available} />
        {descriptions && (
          <p className=" text-3xs text-black text-opacity-60 font-normal">
            {descriptions}
          </p>
        )}
        {Boolean(colors?.length) && <Colors colors={colors} />}
        {tasteChart && <RangesTaste taste={Object.entries(tasteChart)} />}
      </div>
      <Price price={price} discount={discount} />
      <ProductActions data={data} id={id} likes={likes} />
    </div>
  );
};

export { ProductOverview };
