import { Typography } from "@/compoents/atoms";
import {
  ProductAvailability,
  Colors,
  Price,
  DeliveryInfo
} from "@/compoents/molecules";
import { ProductActions, RangesTaste } from "@/compoents/organisms";
import { FC } from "react";

interface ProductOverviewProps {
  data: any;
  id: string;
}

const ProductOverview: FC<ProductOverviewProps> = ({ data, id }) => {
  const {
    name,
    numberOf,
    odId,
    likes,
    price,
    discount,
    product,
    compositeId,
    productOdId,
    additionalInfo
  } = data;
  const tastes = product?.at(0)?.tobacco?.data?.attributes?.tasteChart;
  return (
    <div className="flex flex-col flex-[70%] md:flex-[60%] gap-6">
      <div className="flex flex-col w-full gap-4 pb-6 border-b border-b-black border-opacity-10">
        <Typography tag="h1" className="!text-base-xl" text={name} />
        <ProductAvailability available={Boolean(numberOf)} />
        {productOdId && additionalInfo && (
          <Colors productOdId={productOdId} compositeId={compositeId} />
        )}
        {tastes && <RangesTaste taste={Object.entries(tastes)} />}
      </div>
      <Price price={price} discount={discount} />
      <ProductActions
        data={data}
        id={id}
        odId={odId}
        likes={likes}
        numberOf={numberOf}
      />
      <DeliveryInfo />
    </div>
  );
};

export { ProductOverview };
