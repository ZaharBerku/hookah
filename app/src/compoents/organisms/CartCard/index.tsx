"use client";

import { Typography, Button, Icon } from "@/compoents/atoms";
import { Counter } from "@/compoents/molecules";
import Image from "next/image";
import { FC } from "react";

import { useStores } from "@/hooks";
import { calculeteAmountWithDiscount } from "@/utils/helpers";
import { modalNames } from "@/utils/variables";

interface CartCardProps {
  id: string;
  image: any;
  name: string;
  discount: number;
  price: number;
  quantity: number;
}

const CartCard: FC<CartCardProps> = ({
  id,
  image,
  name,
  price,
  discount,
  quantity
}) => {
  const priceWithDiscount = calculeteAmountWithDiscount(price, discount);
  const { modal } = useStores();

  const handleDelete = () => {
    modal.data = {
      [modalNames.ModalDeleteProductFromCart]: { id }
    };
    modal.openModal(modalNames.ModalDeleteProductFromCart);
  };

  return (
    <article className="w-full py-6 flex gap-4">
      <div className="relative rounded-lg max-w-32 h-32 w-full shadow-3xl shadow-card-shadow-color">
        <Image
          fill
          src={image?.src || "/images/avatar.png"}
          alt={image?.alt || "product"}
          objectFit="cover"
        />
      </div>
      <div className="flex flex-col w-full justify-between">
        <div className="flex items-center justify-between">
          <div>
            <Typography className="truncate text-start" tag="h5" text={name} />
            <span></span>
          </div>
          <Button onClick={handleDelete} color="transparent">
            <Icon type="BasketIcon" className="stroke-accent-content w-6 h-6" />
          </Button>
        </div>
        <div className="w-full flex items-center justify-between">
          <div className="flex gap-4">
            <span className="text-base font-bold">₴{priceWithDiscount}</span>
            {Boolean(discount) && (
              <span className="text-base font-bold text-primary-base line-through">
                ₴{price}
              </span>
            )}
          </div>
          <Counter initialValue={quantity} id={id} />
        </div>
      </div>
    </article>
  );
};

export { CartCard };
