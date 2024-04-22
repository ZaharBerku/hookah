"use client";

import { Button, Icon } from "@/compoents/atoms";
import { Cart } from "@/compoents/molecules";
import cx from "clsx";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";

import { useStores } from "@/hooks";
import { useRouter } from "@/utils/navigation";

const DEFAULT_QUANTITY = 0;

const ShoppingCart = observer(() => {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const [openCart, setOpenCart] = useState(false);
  const { cart } = useStores();

  const handleClick = () => {
    router.push("/cart");
  };
  const handleMouse = () => {
    setOpenCart(true);
  };
  const handleMouseLeave = () => {
    setOpenCart(false);
  };

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  return (
    <>
      {openCart && (
        <div onMouseEnter={handleMouseLeave} className="fixed inset-0"></div>
      )}
      <div onMouseEnter={handleMouse} className={"relative z-10"}>
        <Button color="transparent" className="relative z-30 mr-3">
          <Icon
            className={cx(
              "w-6 h-6 md:w-8 md:h-8",
              openCart ? "fill-black" : "fill-black md:fill-white"
            )}
            type="CartIcon"
          />
          <span className="bg-primary text-black text-xxs flex justify-center items-center w-4 h-4 rounded-full absolute top-0 left-full">
            {isClient ? cart.totalProductQuantity : DEFAULT_QUANTITY}
          </span>
        </Button>
        {openCart && <Cart />}
      </div>
    </>
  );
});

export { ShoppingCart };
