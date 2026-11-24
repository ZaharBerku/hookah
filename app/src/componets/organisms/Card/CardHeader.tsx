import { Icon } from "@/componets/atoms";
import { Image } from "@/componets/atoms";
import { type FC, useState } from "react";

import { MOBILE_SIZES_MEDIA } from "@/utils/breakpoints";
import type { TFormatsObject } from "@/utils/types";

import type { CardProps, CardType } from "./index";

const CARD_IMAGE_SIZES = `${MOBILE_SIZES_MEDIA} 12.375rem, 18.4375rem`;

interface CardHeaderProps
  extends Pick<CardType, "image">,
    Pick<CardProps, "imageLoading" | "initiallyLoaded"> {
  formats: TFormatsObject;
  showImage: boolean;
}

const CardHeader: FC<CardHeaderProps> = ({
  image,
  formats,
  showImage,
  imageLoading,
  initiallyLoaded = false
}) => {
  const [isLoaded, setIsLoaded] = useState(initiallyLoaded);

  return (
    <div className="overflow-hidden bg-white relative h-auto aspect-square w-full shadow-4xl rounded-2xl shadow-card-shadow-color">
      {showImage && !isLoaded && (
        <div className="absolute translate-x-1/2 -translate-y-1/2 right-1/2 top-1/2">
          <Icon type="SpinnerIcon" className="w-24 animate-spin h-24 " />
        </div>
      )}
      {showImage ? (
        <Image
          formats={formats}
          fallbackSrc={image.src}
          alt={image.alt}
          sizes={CARD_IMAGE_SIZES}
          loading={imageLoading}
          setIsLoaded={setIsLoaded}
          isLoaded={isLoaded}
        />
      ) : (
        <>
          <span className="sr-only" role="img" aria-label={image.alt} />
          <noscript>
            <Image
              formats={formats}
              fallbackSrc={image.src}
              alt=""
              sizes={CARD_IMAGE_SIZES}
              isLoaded
            />
          </noscript>
        </>
      )}
    </div>
  );
};

export { CardHeader };
