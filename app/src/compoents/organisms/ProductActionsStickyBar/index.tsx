import { Liker, BuyButton, Price } from "@/compoents/molecules";
import clsx from "clsx";
import { FC } from "react";

interface ProductActionsStickyBarProps {
  id: string;
  odId: string;
  likes: string;
  data: any;
  numberOf?: number;
}

const ProductActionsStickyBar: FC<ProductActionsStickyBarProps> = ({
  id,
  likes,
  data,
  odId
}) => {
  return (
    <div
      className={
        "flex justify-between items-center gap-5 fixed md:hidden w-full bg-white bottom-0 left-0 p-4 shadow-3xl shadow-card-shadow-color"
      }
    >
      <div className="flex-1">
        <Price price={data.price} discount={data.discount} />
      </div>
      <div className="flex gap-1 flex-1">
        <Liker id={id} likes={likes} odId={odId} />
        <BuyButton data={data} id={id} full={true} />
      </div>
    </div>
  );
};

export { ProductActionsStickyBar };
