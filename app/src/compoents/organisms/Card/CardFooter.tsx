"use client";

import { Button } from "@/compoents/atoms";
import { Liker, Counter } from "@/compoents/molecules";
import { observer } from "mobx-react-lite";
import { useTranslations } from "next-intl";
import { FC } from "react";

import { useStores } from "@/hooks";

import { CardProps } from "./index";

interface CardFooterProps extends CardProps {
  id: string;
}

const CardFooter: FC<CardFooterProps> = observer(({ card, id }) => {
  const t = useTranslations("Button.Buy");
  const {
    cart: { cart }
  } = useStores();
  const product = cart.find((product: any) => product.id === id);

  return (
    <div className="flex w-full gap-2 md:gap-4 justify-between">
      <Liker id={id} likes={card.likes} />
      {product ? (
        <Counter id={id} initialValue={product.quantity} />
      ) : (
        <Button data-product={JSON.stringify({ ...card, id })} full>
          {t("text")}
        </Button>
      )}
    </div>
  );
});

export { CardFooter };
