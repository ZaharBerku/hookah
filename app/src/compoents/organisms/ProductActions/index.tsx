import { Button } from "@/compoents/atoms";
import { Counter, Liker } from "@/compoents/molecules";
import { observer } from "mobx-react-lite";
import { FC } from "react";
import toast from "react-hot-toast";

import { useStores } from "@/hooks";

interface ProductActionsProps {
  id: string;
  likes: string;
  data: any;
}

const ProductActions: FC<ProductActionsProps> = observer(
  ({ id, likes, data }) => {
    const {
      cart: { cart, addProductToCart }
    } = useStores();
    const product = cart.find((product: any) => product.id === id);

    const handleClickBuy = () => {
      toast.success("Продукт був успішно доданий до корзини");
      addProductToCart({ id, ...data });
    };
    return (
      <div className="flex justify-between gap-5">
        <Counter id={id} initialValue={product?.quantity || 0} />
        <Button onClick={handleClickBuy} className="flex-1">
          Купити
        </Button>
        <Liker id={id} likes={likes} />
      </div>
    );
  }
);

export { ProductActions };
