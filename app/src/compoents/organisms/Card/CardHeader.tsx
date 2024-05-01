import Image from "next/image";
import { FC } from "react";

import { CardType } from "./index";

interface CardHeaderProps extends Pick<CardType, "image"> {}

const CardHeader: FC<CardHeaderProps> = ({ image }) => {
  return (
    <div className="overflow-hidden bg-white relative h-49 md:h-74 w-full shadow-4xl rounded-2xl shadow-card-shadow-color">
      <Image fill src={image?.src || "/images/avatar.png"} alt={image?.alt || "product"} />
    </div>
  );
};

export { CardHeader };
