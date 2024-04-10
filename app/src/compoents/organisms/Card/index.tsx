import { FC } from "react";

import { CardBody } from "./CardBody";
import { CardFooter } from "./CardFooter";
import { CardHeader } from "./CardHeader";

export interface CardProps {
  image: {
    src: string;
    alt: string;
  };
  name: string;
  likes: number;
  price: number;
  discount: number;
}

const Card: FC<CardProps> = ({ image, name, likes, price, discount }) => {
  return (
    <article className="max-w-49 md:max-w-74 flex flex-col w-full gap-2 md:gap-4">
      <CardHeader image={image} />
      <CardBody price={price} name={name} discount={discount} />
      <CardFooter likes={likes} />
    </article>
  );
};

export { Card };
