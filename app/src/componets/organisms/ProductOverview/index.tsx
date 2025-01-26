import { Typography } from "@/componets/atoms";
import {
  ProductAvailability,
  Colors,
  Price,
  DeliveryInfo
} from "@/componets/molecules";
import { ProductActions, RangesTaste } from "@/componets/organisms";
import { DocumentNode } from "@apollo/client";
import { FC } from "react";

interface ProductOverviewProps {
  data: any;
  id: string;
  query?: DocumentNode;
}

const ProductOverview: FC<ProductOverviewProps> = ({ data, id, query }) => {
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
  console.log(productOdId, additionalInfo);
  const tastes = product?.at(0)?.tobacco?.data?.attributes?.tasteChart;
  return (
    <div className="flex flex-col flex-[70%] md:flex-[60%] gap-6">
      <div className="flex flex-col w-full gap-4 pb-6 border-b border-b-black border-opacity-10">
        <Typography tag="h1" className="!text-base-xl" text={name} />
        <ProductAvailability available={Boolean(numberOf)} />
        {productOdId && additionalInfo && query && (
          <Colors
            productOdId={productOdId}
            compositeId={compositeId}
            query={query}
          />
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
