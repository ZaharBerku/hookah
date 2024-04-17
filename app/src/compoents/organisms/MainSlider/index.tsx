"use client";

import { Menu } from "@/compoents/molecules";
import Image from "next/image";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const MainSlider = () => {
  return (
    <div className="flex gap-10 w-full relative">
      <Menu className="hidden md:flex" />
      <Swiper
        slidesPerView={"auto"}
        loop={true}
        spaceBetween={20}
        navigation={true}
        modules={[Autoplay, Pagination]}
        className="mySwiper"
      >
        <SwiperSlide>
          <div className="relative h-80 md:h-96 rounded-lg">
            <Image
              src={"/images/slide.jpg"}
              objectFit="cover"
              fill
              alt={"slider-pics"}
              className="rounded-lg"
            />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="relative h-80 md:h-96 rounded-lg">
            <Image
              src={"/images/slide.jpg"}
              fill
              alt={"slider-pics"}
              className="rounded-lg"
            />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="relative h-80 md:h-96 rounded-lg">
            <Image
              src={"/images/slide.jpg"}
              fill
              alt={"slider-pics"}
              className="rounded-lg"
            />
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export { MainSlider };
