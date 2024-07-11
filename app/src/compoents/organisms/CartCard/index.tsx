"use client";

import { Typography, Button, Icon } from "@/compoents/atoms";
import { Counter } from "@/compoents/molecules";
import Image from "next/image";
import { FC } from "react";

import { useStores } from "@/hooks";
import { calculeteAmountWithDiscount } from "@/utils/helpers";
import { modalNames } from "@/utils/variables";

interface CartCardProps {
  compositeId: string;
  image: any;
  name: string;
  discount: number;
  price: number;
  quantity: number;
}

const CartCard: FC<CartCardProps> = ({
  compositeId,
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
      [modalNames.ModalDeleteProductFromCart]: { compositeId }
    };
    modal.openModal(modalNames.ModalDeleteProductFromCart);
  };

  return (
    <article className="w-full py-6 flex gap-4">
      <div className="relative rounded-lg min-w-16 h-16 md:min-w-32 md:h-32 shadow-3xl shadow-card-shadow-color">
        <Image
          fill
          src={image?.src || "/images/avatar.png"}
          alt={image?.alt || "product"}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="rounded-lg object-cover"
        />
      </div>
      <div className="flex flex-col w-full justify-between">
        <div className="flex items-center justify-between">
          <Typography
            className="overflow-hidden text-ellipsis-1 line-clamp-1 text-start md:text-base"
            tag="h5"
            text={name}
          />

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
          <Counter initialValue={quantity} compositeId={compositeId} />
        </div>
      </div>
    </article>
  );
};

export { CartCard };
