import { Button } from "@/compoents/atoms";
import { Counter, Liker } from "@/compoents/molecules";
import clsx from "clsx";
import { observer } from "mobx-react-lite";
import { useTranslations } from "next-intl";
import { FC } from "react";
import toast from "react-hot-toast";

import { useStores } from "@/hooks";

interface ProductActionsProps {
  id: string;
  odId: string;
  likes: string;
  data: any;
  className?: string;
  numberOf?: number;
}

const ProductActions: FC<ProductActionsProps> = observer(
  ({ id, likes, data, className, numberOf, odId }) => {
    const {
      cart: { cart, addProductToCart }
    } = useStores();
    const product = cart.find((product: any) => product.id === id);
    const t = useTranslations("Button.Buy");
    const handleClickBuy = () => {
      toast.success("Продукт був успішно доданий до корзини");
      addProductToCart({ id, ...data });
    };

    return (
      <div className={clsx("flex justify-between gap-5", className)}>
        {product ? (
          <Counter id={id} initialValue={product?.quantity || 0} />
        ) : (
          <Button
            disabled={!numberOf}
            onClick={handleClickBuy}
            className="flex-1"
          >
            {t("text")}
          </Button>
        )}

        <Liker id={id} likes={likes} odId={odId} />
      </div>
    );
  }
);

export { ProductActions };
