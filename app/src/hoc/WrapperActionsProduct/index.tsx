import { MouseEvent, PropsWithChildren, FC } from "react";
import toast from "react-hot-toast";

import { useStores } from "@/hooks";
import { useRouter } from "@/utils/navigation";

interface WrapperActionsProductProps extends PropsWithChildren {}

const WrapperActionsProduct: FC<WrapperActionsProductProps> = ({
  children
}) => {
  const { cart } = useStores();
  const router = useRouter();
  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    const cardElement = (event.target as HTMLDivElement)?.closest(
      "[data-card]"
    );
    const colorElement = (event.target as HTMLDivElement)?.closest(
      "[data-color]"
    );
    const buttonBuy = (event.target as HTMLDivElement)?.closest(
      "[data-product]"
    );

    if (buttonBuy) {
      const product = (buttonBuy as any)?.dataset.product;
      cart.addProductToCart(JSON.parse(product));
      toast.success("Продукт був успішно доданий до корзини");
    } else if (cardElement && !colorElement) {
      const card = JSON.parse((cardElement as any)?.dataset.card);
      router.push(`/${card.category}/${card.brand}/${card.compositeId}`);
    }
  };

  return (
    <div className="w-full" onClick={handleClick}>
      {children}
    </div>
  );
};

export { WrapperActionsProduct };
