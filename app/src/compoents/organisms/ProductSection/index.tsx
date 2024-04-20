"use client";

import { Button, Icon } from "@/compoents/atoms";
import { SectionName } from "@/compoents/molecules";
import { Card } from "@/compoents/organisms";
import { useRouter } from "next/navigation";
import { FC, useCallback, useRef, MouseEvent } from "react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { useStores } from "@/hooks";

interface ProductSectionProps {
  data: any;
  name: string;
  content: string;
}

const ProductSection: FC<ProductSectionProps> = ({ data, name, content }) => {
  const sliderRef = useRef<any>(null);
  const router = useRouter();
  const { cart } = useStores();

  const handlePrev = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current?.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current?.swiper.slideNext();
  }, []);

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    const cardElement = (event.target as HTMLDivElement)?.closest(
      "[data-card]"
    );
    const buttonLike = (event.target as HTMLDivElement)?.closest("[data-like]");
    const buttonBuy = (event.target as HTMLDivElement)?.closest(
      "[data-product]"
    );

    if (buttonLike) {
      const cardId = (buttonLike as any)?.dataset.like;
    } else if (buttonBuy) {
      const product = (buttonBuy as any)?.dataset.product;
      cart.addProductToCart(JSON.parse(product));
    } else if (cardElement) {
      const cardId = (cardElement as any)?.dataset.card;
      router.push(`/card/${cardId}`);
    }
  };

  return (
    <section className="flex flex-col w-full gap-8 md:gap-14 relative">
      <div className="flex justify-between items-center">
        <SectionName name={name} content={content} />
        <div className="hidden md:flex gap-2">
          <Button
            onClick={handlePrev}
            className="flex justify-center items-center bg-custom-accent-base min-w-11 h-11 rounded-full"
            color="transparent"
          >
            <Icon
              type="ArrowRightIcon"
              className="w-6 h-5 rotate-180 stroke-black"
            />
          </Button>
          <Button
            onClick={handleNext}
            className="flex justify-center items-center bg-custom-accent-base min-w-11 h-11 rounded-full"
            color="transparent"
          >
            <Icon type="ArrowRightIcon" className="w-6 h-5 stroke-black" />
          </Button>
        </div>
      </div>
      <div onClick={handleClick}>
        <Swiper
          slidesPerView={"auto"}
          loop={true}
          ref={sliderRef}
          breakpoints={{
            320: {
              slidesPerView: 2,
              spaceBetween: 16
            },
            480: {
              slidesPerView: 3,
              spaceBetween: 16
            },
            640: {
              slidesPerView: 3,
              spaceBetween: 16
            },
            840: {
              slidesPerView: 3,
              spaceBetween: 20
            },
            980: {
              slidesPerView: 4,
              spaceBetween: 20
            }
          }}
          modules={[Autoplay, Pagination]}
          className="mySwiper"
        >
          {data.map((card: any) => {
            return (
              <SwiperSlide key={card.id}>
                <Card card={card} />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
      <Button
        className="md:max-w-49 w-full self-end !h-12 md:!h-10"
        color="second"
      >
        Дивитись всі
      </Button>
    </section>
  );
};

export { ProductSection };
