"use client";

import { Button, Icon } from "@/compoents/atoms";
import { Cart } from "@/compoents/molecules";
import cx from "clsx";
import { useState } from "react";

import { useRouter } from "@/utils/navigation";

const ShoppingCart = () => {
  const router = useRouter();
  const [openCart, setOpenCart] = useState(false);
  const handleClick = () => {
    router.push("/cart");
  };
  const handleMouse = () => {
    setOpenCart(true);
  };
  const handleMouseLeave = () => {
    setOpenCart(false);
  };
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
              openCart ? "fill-black" : "fill-white"
            )}
            type="CartIcon"
          />
          <span className="bg-primary text-black text-xs w-4 h-4 rounded-full absolute top-0 left-full">
            1
          </span>
        </Button>
        {openCart && <Cart />}
      </div>
    </>
  );
};

export { ShoppingCart };
