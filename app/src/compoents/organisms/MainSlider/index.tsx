"use client";

import { Menu } from "@/compoents/molecules";
import Image from "next/image";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const MainSlider = () => {
  return (
    <section className="flex gap-10 w-full relative">
      <div className="hidden md:block relative max-w-74 w-full">
        <Menu
          classes={{ wrapper: "absolute min-w-74 z-20", list: "min-w-74" }}
        />
      </div>
      <Swiper
        slidesPerView={"auto"}
        pagination={{
          clickable: true
        }}
        loop={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false
        }}
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
    </section>
  );
};

export { MainSlider };
