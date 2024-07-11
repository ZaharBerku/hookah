import { Icon } from "@/compoents/atoms";
import Image from "next/image";
import { FC, useState } from "react";

import { CardType } from "./index";

interface CardHeaderProps extends Pick<CardType, "image"> {}

const CardHeader: FC<CardHeaderProps> = ({ image }) => {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <div className="overflow-hidden bg-white relative h-49 md:h-74 w-full shadow-4xl rounded-2xl shadow-card-shadow-color">
      {isLoading && (
        <Icon
          type="SpinnerIcon"
          className="w-24 h-24 absolute translate-x-1/2 -translate-y-1/2 right-1/2 top-1/2"
        />
      )}
      <Image
        fill
        className="object-contain"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        src={image?.src || "/images/avatar.png"}
        alt={image?.alt || "product"}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
};

export { CardHeader };
