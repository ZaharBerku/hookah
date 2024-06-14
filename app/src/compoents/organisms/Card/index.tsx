import { memo } from "react";

import { CardBody } from "./CardBody";
import { CardFooter } from "./CardFooter";
import { CardHeader } from "./CardHeader";

export type CardType = {
  id: string;
  image: {
    src: string;
    alt: string;
  };
  name: string;
  likes: number;
  price: number;
  discount: number;
  colors: string[];
};

export interface CardProps {
  card: any;
}

const Card = memo<CardProps>(({ card }) => {
  const { id, attributes } = card;
  const { name, price, discount, colors, category, previewImage, compositeId } =
    attributes;
  const {
    data: {
      attributes: { name: categoryName }
    }
  } = category;
  const {
    data: {
      attributes: { url }
    }
  } = previewImage;

  return (
    <article
      data-card={JSON.stringify({
        category: categoryName,
        id,
        compositeId
      })}
      className="max-w-49 flex-1 md:max-w-74 cursor-pointer flex flex-col w-full h-full gap-2 md:gap-4"
    >
      <CardHeader
        image={{
          src: url,
          alt: ""
        }}
      />
      <CardBody price={price} name={name} discount={discount} colors={colors} />
      <CardFooter card={attributes} id={id} />
    </article>
  );
});

Card.displayName = "Card";

export { Card };
