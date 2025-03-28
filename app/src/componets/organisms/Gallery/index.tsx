"use client";

import { Icon } from "@/componets/atoms";
import { PaginationButton } from "@/componets/molecules";
import clsx from "clsx";
import Image, { type ImageProps } from "next/image";
import "photoswipe/dist/photoswipe.css";
import { type FC, forwardRef, useCallback, useRef, useState } from "react";
import { Gallery as GalleryWrapper, Item } from "react-photoswipe-gallery";
import "swiper/css";
import "swiper/css/pagination";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { useImageDimensions } from "@/hooks";
import { replaceS3WithCDN } from "@/utils/helpers/replaceS3WithCDN";

interface GalleryItemProps extends ImageProps {
  classNameWrapper?: string;
  isMainItem?: boolean;
  ref?: any;
}

interface GalleryProps {
  images: any;
}

const GalleryItem: FC<GalleryItemProps> = forwardRef<
  HTMLDivElement,
  GalleryItemProps
>(({ classNameWrapper, isMainItem, className, onClick, ...props }, ref) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div
      ref={ref}
      onClick={onClick}
      className={clsx(
        "relative flex justify-center items-center border border-gray-300 rounded-3xl",
        classNameWrapper,
        isMainItem ? "aspect-square" : "aspect-[1/1]"
      )}
    >
      {isLoading && (
        <div
          className={clsx(
            "absolute inset-0 flex justify-center items-center",
            isMainItem ? "py-24" : "py-6"
          )}
        >
          <Icon
            type="SpinnerIcon"
            className={clsx(
              "animate-spin",
              isMainItem ? "w-24 h-24" : "w-20 h-20"
            )}
          />
        </div>
      )}
      <Image
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        {...props}
        loading="lazy"
        unoptimized
        className={clsx(className, "transition-all opacity-0", {
          "opacity-100": !isLoading
        })}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
});

GalleryItem.displayName = "GalleryItem";

const GalleryItemWithSwipe: FC<Omit<GalleryItemProps, "ref">> = ({
  src,
  alt,
  ...props
}) => {
  const { width, height } = useImageDimensions({ url: src as string });
  return (
    <Item
      original={src as string}
      thumbnail={src as string}
      width={width || 500}
      height={height || 500}
      alt={alt || "product"}
    >
      {({ ref, open }) => (
        <GalleryItem
          {...props}
          onClick={open}
          ref={ref}
          src={src}
          alt={alt || "product"}
        />
      )}
    </Item>
  );
};

const Gallery: FC<GalleryProps> = ({ images }) => {
  const initialSelectImage = images.at(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const sliderRef = useRef<any>(null);
  const handlePrev = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current?.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current?.swiper.slideNext();
  }, []);

  return (
    <div className="max-w-xl w-full flex-[30%] md:flex-[40%] h-auto md:h-148 flex gap-5 justify-start items-start flex-col-reverse md:flex-row">
      <GalleryWrapper>
        {images.length > 1 ? (
          <>
            <Swiper
              onSwiper={(swiper) => setThumbsSwiper(swiper)}
              spaceBetween={10}
              slidesPerView={3}
              breakpoints={{
                480: {
                  direction: "horizontal"
                },
                780: {
                  direction: "vertical"
                }
              }}
              freeMode={true}
              watchSlidesProgress={true}
              modules={[FreeMode, Navigation, Thumbs]}
              className="flex-[30%]"
            >
              {images?.map((img: any, index: number) => {
                return (
                  <SwiperSlide key={index}>
                    <GalleryItem
                      classNameWrapper={clsx("w-full h-full", {
                        "!border-primary": index === selectedIndex
                      })}
                      className="rounded-3xl object-cover !static"
                      key={index}
                      src={replaceS3WithCDN(
                        img.attributes?.formats?.medium?.webp?.url ||
                          img.attributes.url
                      )}
                      alt={img.attributes?.alternativeText || "product"}
                    />
                  </SwiperSlide>
                );
              })}
            </Swiper>
            <Swiper
              spaceBetween={10}
              navigation={true}
              ref={sliderRef}
              thumbs={{ swiper: thumbsSwiper }}
              modules={[FreeMode, Navigation, Thumbs]}
              onSlideChange={(swiper) => setSelectedIndex(swiper.activeIndex)}
              className="flex-[70%]"
            >
              <PaginationButton
                className="absolute left-2 z-50 top-1/2 -translate-y-1/2"
                handleClick={handlePrev}
                type="left"
              />
              <PaginationButton
                className="absolute right-2 z-50 top-1/2 -translate-y-1/2"
                handleClick={handleNext}
                type="right"
              />
              {images?.map((img: any, index: number) => {
                return (
                  <SwiperSlide key={index}>
                    <GalleryItemWithSwipe
                      classNameWrapper="w-full h-full"
                      className="rounded-3xl !object-contain !static"
                      key={`image_${img.attributes.url}`}
                      src={replaceS3WithCDN(
                        img.attributes?.formats?.medium?.webp?.url ||
                          img.attributes.url
                      )}
                      alt={img.attributes?.alternativeText || "product"}
                    />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </>
        ) : (
          <GalleryItemWithSwipe
            classNameWrapper="w-full md:max-w-[450px] aspect-square flex-1 h-auto rounded-3xl"
            className="object-contain rounded-3xl"
            src={
              initialSelectImage.attributes?.formats?.medium?.webp?.url ||
              initialSelectImage.attributes.url
            }
            alt={initialSelectImage?.attributes?.alternativeText || "product"}
          />
        )}
      </GalleryWrapper>
    </div>
  );
};

export { Gallery };
