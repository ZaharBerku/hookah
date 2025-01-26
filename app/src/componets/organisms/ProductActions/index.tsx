import { Liker, BuyButton } from "@/componets/molecules";
import clsx from "clsx";
import { observer } from "mobx-react-lite";
import { FC } from "react";

interface ProductActionsProps {
  id: string;
  odId: string;
  likes: string;
  data: any;
  className?: string;
  numberOf?: number;
}

const ProductActions: FC<ProductActionsProps> = observer(
  ({ id, likes, data, className, odId }) => {
    return (
      <div className={clsx("flex justify-between gap-5", className)}>
        <BuyButton data={data} id={id} full={true} />
        <div className="hidden md:block">
          <Liker id={id} likes={likes} odId={odId} />
        </div>
      </div>
    );
  }
);

export { ProductActions };
