import { memo } from "react";

import { CardBody } from "./CardBody";
import { CardFooter } from "./CardFooter";
import { CardHeader } from "./CardHeader";
import { DisabledCape } from "./DisabledCape";

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
  const {
    name,
    price,
    discount,
    colors,
    category,
    previewImage,
    compositeId,
    numberOf,
    brand,
    type
  } = attributes;
  const {
    data: {
      attributes: { name: categoryName }
    }
  } = category;
  const {
    data: {
      attributes: { url, alternativeText }
    }
  } = previewImage;
  const {
    data: {
      attributes: { slug }
    }
  } = brand;

  return (
    <article
      data-card={JSON.stringify({
        category: categoryName,
        type: type?.data?.attributes?.slugType,
        id,
        compositeId,
        brand: slug
      })}
      className="max-w-49 flex-1 md:max-w-74 cursor-pointer flex flex-col justify-center items-center w-full h-full gap-2 md:gap-4 relative"
    >
      {!numberOf && <DisabledCape />}
      <CardHeader
        image={{
          src: url,
          alt: alternativeText || "product"
        }}
      />
      <CardBody price={price} name={name} discount={discount} colors={colors} />
      <CardFooter card={attributes} id={id} odId={attributes.odId} />
    </article>
  );
});

Card.displayName = "Card";

export { Card };
