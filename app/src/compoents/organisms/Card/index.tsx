import { FC } from "react";

import { CardBody } from "./CardBody";
import { CardFooter } from "./CardFooter";
import { CardHeader } from "./CardHeader";

export type CardType = {
  id: number;
  image: {
    src: string;
    alt: string;
  };
  name: string;
  likes: number;
  price: number;
  discount: number;
};

export interface CardProps {
  card: CardType;
}

const Card: FC<CardProps> = ({ card }) => {
  const { image, name, likes, price, discount, id } = card;
  return (
    <article
      data-card={id}
      className="max-w-49 flex-1 md:max-w-74 cursor-pointer flex flex-col w-full gap-2 md:gap-4"
    >
      <CardHeader image={image} />
      <CardBody price={price} name={name} discount={discount} />
      <CardFooter card={card} />
    </article>
  );
};

export { Card };
