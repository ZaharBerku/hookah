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
    <div className="flex flex-col w-full relative">
      <SectionName name={name} content={content} />
      <Swiper
        slidesPerView={"auto"}
        loop={true}
        navigation={true}
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
      <Button
        className="md:max-w-49 w-full self-end !h-12 md:!h-10"
        color="second"
      >
        Дивитись всі
      </Button>
    </div>
  );
};

export { ProductSection };
