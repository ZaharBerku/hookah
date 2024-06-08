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
    numberOf,
    likes,
    price,
    discount,
    product
  } = data;
  const tastes = product?.at(0)?.tobacco?.data?.attributes?.tasteChart;
  return (
    <div className="flex flex-col flex-[70%] md:flex-[60%] gap-6">
      <div className="flex flex-col w-full gap-4 pb-6 border-b border-b-black border-opacity-10">
        <Typography tag="h1" text={name} />
        <ProductAvailability available={Boolean(numberOf)} />
        {descriptions && (
          <p className=" text-3xs text-black text-opacity-60 font-normal">
            {descriptions}
          </p>
        )}
        {Boolean(colors?.length) && <Colors colors={colors} />}
        {tastes && <RangesTaste taste={Object.entries(tastes)} />}
      </div>
      <Price price={price} discount={discount} />
      <ProductActions data={data} id={id} likes={likes} />
    </div>
  );
};

export { ProductOverview };
