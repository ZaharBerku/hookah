import { Icon } from "@/componets/atoms";
import { Image } from "@/componets/atoms";
import { type FC, useState } from "react";

import type { TFormatsObject } from "@/utils/types";

import type { CardType } from "./index";

interface CardHeaderProps extends Pick<CardType, "image"> {
  formats: TFormatsObject;
}

const CardHeader: FC<CardHeaderProps> = ({ image, formats }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="overflow-hidden bg-white relative h-auto aspect-square w-full shadow-4xl rounded-2xl shadow-card-shadow-color">
      {!isLoaded && (
        <div className="absolute translate-x-1/2 -translate-y-1/2 right-1/2 top-1/2">
          <Icon type="SpinnerIcon" className="w-24 animate-spin h-24 " />
        </div>
      )}
      <Image
        formats={formats}
        fallbackSrc={image.src}
        alt={image.alt}
        setIsLoaded={setIsLoaded}
        isLoaded={isLoaded}
      />
    </div>
  );
};

export { CardHeader };
