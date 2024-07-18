"use client";

import clsx from "clsx";
import Image, { ImageProps } from "next/image";
import { FC, useEffect, useRef, useState } from "react";
// import { Gallery as GalleryWrapper } from "react-photoswipe-gallery";
import { Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

interface GalleryItemProps extends ImageProps {
  classNameWrapper?: string;
}

interface GalleryProps {
  images: any;
}

const GalleryItem: FC<GalleryItemProps> = ({ classNameWrapper, ...props }) => {
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
    <button className={clsx("relative", classNameWrapper)}>
      <Image
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        {...props}
      />
    </button>
    // )}
    // </Item>
  );
};

const Gallery: FC<GalleryProps> = ({ images }) => {
  const initialSelectImage = images.at(0);
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
      {Boolean(images?.slice(1).length) && (
        <Swiper
          slidesPerView={3}
          spaceBetween={12}
          breakpoints={{
            480: {
              direction: "horizontal"
            },
            780: {
              direction: "vertical"
            }
          }}
          modules={[Autoplay, Pagination]}
          className="md:max-w-36 !m-0 rounded-3xl"
        >
          {images?.slice(1)?.map((img: any, index: number) => {
            return (
              <SwiperSlide
                className="border border-gray-300 rounded-3xl"
                key={index}
              >
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
      )}
      <GalleryItem
        classNameWrapper="w-full flex-1 h-full border border-gray-300 rounded-3xl"
        className="object-contain !static rounded-3xl"
        src={selectImage.attributes.url}
        alt={"product"}
      />
    </div>
  );
};

export { Gallery };
