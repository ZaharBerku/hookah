"use client";

import { Icon } from "@/compoents/atoms";
import { PaginationButton } from "@/compoents/molecules";
import clsx from "clsx";
import Image, { ImageProps } from "next/image";
import { FC, useCallback, useEffect, useRef, useState } from "react";
// import { Gallery as GalleryWrapper } from "react-photoswipe-gallery";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

interface GalleryItemProps extends ImageProps {
  classNameWrapper?: string;
  isMainItem?: boolean;
}

interface GalleryProps {
  images: any;
}

const GalleryItem: FC<GalleryItemProps> = ({
  classNameWrapper,
  isMainItem,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    // <Item
    //   key={`image_${props.src}`}
    //   original={props.src as string}
    //   thumbnail={props.src as string}
    //   width={400}
    //   height={500}
    //   alt={props.alt}
    // >
    //   {({ ref, open }) => (
    <button
      className={clsx(
        "relative flex justify-center items-center border border-gray-300 rounded-3xl",
        classNameWrapper
      )}
    >
      {isLoading && (
        <div className={isMainItem ? "py-24" : "py-6"}>
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
        onLoad={() => setIsLoading(false)}
      />
    </button>
    // )}
    // </Item>
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

  const [selectImage, setSelectImage] = useState(initialSelectImage);
  const elementRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const element = elementRef.current;

    if (element) {
      const updateWidth = () => setWidth(element.offsetWidth);
      updateWidth();

      const resizeObserver = new ResizeObserver(() => {
        updateWidth();
      });

      resizeObserver.observe(element);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, []);

  return (
    <div className="max-w-xl flex-[30%] md:flex-[40%] w-full h-auto md:h-148 flex gap-5 justify-start items-start flex-col-reverse md:flex-row">
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
                onClick={() => setSelectImage(img)}
                classNameWrapper={clsx("w-full h-full", {
                  "!border-primary": index === selectedIndex
                })}
                className="rounded-3xl object-cover !static"
                key={index}
                src={img.attributes.url}
                alt={"product"}
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
              <GalleryItem
                onClick={() => setSelectImage(img)}
                classNameWrapper="w-full h-full"
                className="rounded-3xl object-cover !static"
                key={index}
                src={img.attributes.url}
                alt={"product"}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export { Gallery };
