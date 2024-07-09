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
  odId: string;
}

const CardFooter: FC<CardFooterProps> = observer(({ card, id, odId }) => {
  const t = useTranslations("Button.Buy");
  const {
    cart: { selectedProducts }
  } = useStores();
  const product = selectedProducts[card.compositeId];

  return (
    <div className="flex w-full gap-2 md:gap-4 justify-between">
      <Liker id={id} likes={card.likes} odId={odId} />
      {product ? (
        <Counter
          compositeId={card.compositeId}
          initialValue={product.quantity}
        />
      ) : (
        <Button
          data-product={JSON.stringify({
            id,
            attributes: {
              compositeId: card.compositeId,
              discount: card.discount,
              price: card.price,
              odId: card.odId,
              name: card.name,
              numberOf: card.numberOf
            }
          })}
          full
        >
          {t("text")}
        </Button>
      )}
    </div>
  );
});

export { CardFooter };
