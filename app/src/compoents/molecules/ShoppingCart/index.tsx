"use client";

import { Button, Icon } from "@/compoents/atoms";
// import { Cart } from "@/compoents/molecules";
import { Skeleton } from "@nextui-org/skeleton";
import cx from "clsx";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";

import { useStores } from "@/hooks";

const ShoppingCart = observer(() => {
  const [isClient, setIsClient] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const { cart } = useStores();
  const disabled = !cart.totalProductsQuantity;

  const handleMouse = () => {
    if (!disabled) {
      setOpenCart(true);
    }
  };
  const handleMouseLeave = () => {
    setOpenCart(false);
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div>
      {/* {openCart && (
        <div onMouseEnter={handleMouseLeave} className="fixed inset-0 hidden md:block"></div>
      )} */}
      <div
        // onMouseEnter={handleMouse}
        className={"relative z-10"}
      >
        {isClient ? (
          <Button
            as={"link"}
            disabled={disabled}
            href={"/cart"}
            color="transparent"
            className="relative z-30 mr-1.5 p-2"
          >
            <Icon
              className={cx(
                "w-6 h-6 md:w-8 md:h-8",
                openCart ? "fill-black" : "fill-black md:fill-white"
              )}
              type="CartIcon"
            />
            {!disabled && isClient && (
              <span className="bg-primary text-black font-semibold text-xs flex justify-center items-center w-4 h-4 rounded-full absolute top-0 right-0">
                {cart.totalProductsQuantity}
              </span>
            )}
          </Button>
        ) : (
          <Skeleton className="w-9 h-9 md:w-10 md:h-10 rounded-lg" />
        )}
        {/* {openCart && <Cart />} */}
      </div>
    </div>
  );
});

export { ShoppingCart };
