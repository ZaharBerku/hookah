"use client";

import { Button } from "@/compoents/atoms";
import { SectionName } from "@/compoents/molecules";
import { Card } from "@/compoents/organisms";
import { FC } from "react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";

interface ProductSectionProps {
  data: any;
  name: string;
  content: string;
}

const SwiperButtonNext = () => {
  const swiper = useSwiper();
  return <Button color="transparent"></Button>;
};

const SwiperButtonPrev = () => {
  const swiper = useSwiper();

  return <Button color="transparent"></Button>;
};

const ProductSection: FC<ProductSectionProps> = ({ data, name, content }) => {
  return (
    <section className="flex flex-col w-full gap-4 md:gap-6 relative">
      <SectionName name={name} content={content} />
      <Swiper
        slidesPerView={"auto"}
        loop={true}
        navigation={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false
        }}
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
        {data.map((item: any) => {
          return (
            <SwiperSlide key={item.id}>
              <Card
                image={item.image}
                name={item.name}
                likes={item.likes}
                price={item.price}
                discount={item.discount}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
};

export { ProductSection };
