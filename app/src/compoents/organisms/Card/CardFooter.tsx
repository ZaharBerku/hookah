import { Button } from "@/compoents/atoms";
import { Liker } from "@/compoents/molecules";
import { FC } from "react";

import { CardProps } from "./index";

interface CardFooterProps extends CardProps {}

const CardFooter: FC<CardFooterProps> = ({ card }) => {
  return (
    <div className="flex w-full gap-2 md:gap-4">
      <Liker data-like={card.id} likes={card.likes} />
      <Button data-product={JSON.stringify(card)} full>
        Купити
      </Button>
    </div>
  );
};

export { CardFooter };
