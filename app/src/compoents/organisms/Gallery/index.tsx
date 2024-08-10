"use client";

import { Icon } from "@/compoents/atoms";
import { PaginationButton } from "@/compoents/molecules";
import clsx from "clsx";
import Image, { ImageProps } from "next/image";
import "photoswipe/dist/photoswipe.css";
import { FC, forwardRef, useCallback, useRef, useState } from "react";
import { Gallery as GalleryWrapper, Item } from "react-photoswipe-gallery";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

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
        {
          "aspect-square": isMainItem,
          "aspect-[4/3]": isLoading
        }
      )}
    >
      {isLoading && (
        <div
          className={clsx("absolute inset-0 flex justify-center items-center", {
            "py-24": isMainItem,
            "py-6": !isMainItem
          })}
        >
          <Icon
            type="SpinnerIcon"
            className={isMainItem ? "w-24 h-24" : "w-16 h-16"}
          />
        </div>
      )}
      <Image
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        {...props}
        className={clsx(className, "transition-all opacity-0", {
          "opacity-100": !isLoading
        })}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
});

GalleryItem.displayName = "GalleryItem";

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
                      src={img.attributes.url}
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
                    <Item
                      key={`image_${img.attributes.url}`}
                      original={img.attributes.url as string}
                      thumbnail={img.attributes.url as string}
                      width={500}
                      height={500}
                      alt={img.attributes?.alternativeText || "product"}
                    >
                      {({ ref, open }) => (
                        <GalleryItem
                          classNameWrapper="w-full h-full"
                          className="rounded-3xl object-cover !static"
                          key={index}
                          onClick={open}
                          ref={ref}
                          src={img.attributes.url}
                          alt={img.attributes?.alternativeText || "product"}
                        />
                      )}
                    </Item>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </>
        ) : (
          <Item
            key={`image_${initialSelectImage.attributes.url}`}
            original={initialSelectImage.attributes.url as string}
            thumbnail={initialSelectImage.attributes.url as string}
            width={500}
            height={500}
            alt={initialSelectImage?.attributes?.alternativeText || "product"}
          >
            {({ ref, open }) => (
              <GalleryItem
                classNameWrapper="w-full md:max-w-[450px] aspect-square flex-1 h-auto rounded-3xl"
                className="object-contain rounded-3xl"
                src={initialSelectImage.attributes.url}
                ref={ref}
                onClick={open}
                alt={
                  initialSelectImage?.attributes?.alternativeText || "product"
                }
              />
            )}
          </Item>
        )}
      </GalleryWrapper>
    </div>
  );
};

export { Gallery };
