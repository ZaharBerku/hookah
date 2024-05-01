"use client";

import { Button } from "@/compoents/atoms";
import { Liker, Counter } from "@/compoents/molecules";
import { observer } from "mobx-react-lite";
import { FC } from "react";

import { useStores } from "@/hooks";

import { CardProps } from "./index";

interface CardFooterProps extends CardProps {}

const CardFooter: FC<CardFooterProps> = observer(({ card }) => {
  const {
    cart: { cart }
  } = useStores();
  const product = cart.find((product: any) => product.id === card.id);

  return (
    <div className="flex w-full gap-2 md:gap-4 justify-between">
      <Liker id={card.id} likes={card.likes} />
      {product ? (
        <Counter id={card.id} initialValue={product.quantity} />
      ) : (
        <Button data-product={JSON.stringify(card)} full>
          Купити
        </Button>
      )}
    </div>
  );
});

export { CardFooter };
