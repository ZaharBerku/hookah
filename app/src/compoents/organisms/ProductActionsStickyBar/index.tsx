import { Liker, BuyButton, Price } from "@/compoents/molecules";
import { FC, useEffect } from "react";

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
  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (isMobile) {
      document.body.style.paddingBottom = "76px";
      return () => {
        document.body.style.paddingBottom = "0px";
      };
    }
  }, []);
  return (
    <div
      className={
        "flex justify-between items-center gap-5 fixed md:hidden w-full bg-white bottom-0 left-0 p-4 shadow-2xl shadow-black"
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
