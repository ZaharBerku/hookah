import clsx from "clsx";
import Image, { ImageProps } from "next/image";
import { FC, useEffect, useRef, useState } from "react";
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
    <button
      className={clsx(
        "relative",
        classNameWrapper
      )}
    >
      <Image fill {...props} />
    </button>
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
    <div className="max-w-2xl h-148 flex gap-5 justify-center items-center flex-col-reverse md:flex-row">
      <Swiper
        slidesPerView={3}
        spaceBetween={16}
        breakpoints={{
          480: {
            direction: "horizontal"
          },
          780: {
            direction: "vertical"
          }
        }}
        modules={[Autoplay, Pagination]}
        className="md:max-w-48 !m-0 shadow-card-shadow-color shadow-4xl"
      >
        {images.slice(1).map((img: any, index: number) => {
          return (
            <SwiperSlide className="max-h-48 md:max-w-48 shadow-card-shadow-color shadow-4xl rounded-3xl" key={index}>
              <GalleryItem
                onClick={() => setSelectImage(img)}
                classNameWrapper="w-full h-full"
                key={index}
                src={img.src}
                alt={img.alt}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>

      <GalleryItem
        classNameWrapper="md:max-w-96 h-full w-full shadow-card-shadow-color shadow-4xl rounded-3xl"
        className="object-contain"
        src={selectImage.src}
        alt={selectImage.alt}
      />
    </div>
  );
};

export { Gallery };
