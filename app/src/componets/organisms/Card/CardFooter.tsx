"use client";

import { Liker, BuyButton } from "@/componets/molecules";
import { observer } from "mobx-react-lite";
import { FC } from "react";

import { CardProps } from "./index";

interface CardFooterProps extends CardProps {
  id: string;
  odId: string;
}

const CardFooter: FC<CardFooterProps> = observer(({ card, id, odId }) => {
  return (
    <div className="flex w-full gap-2 md:gap-4 justify-between">
      <Liker id={id} likes={card.likes} odId={odId} />
      <BuyButton data={card} id={id} />
    </div>
  );
});

export { CardFooter };
