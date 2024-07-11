"use client";

import { Menu } from "@/compoents/molecules";
import Image from "next/image";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { Link } from "@/utils/navigation";

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
        <SwiperSlide className="!h-auto">
          <div className="relative rounded-lg">
            <Image
              src={"/images/slide-1.jpg"}
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              alt={"slider-pics"}
              className="rounded-lg !static object-contain"
            />
          </div>
        </SwiperSlide>
        <SwiperSlide className="!h-auto">
          <div className="relative rounded-lg">
            <Image
              src={"/images/slide-2.jpg"}
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              alt={"slider-pics"}
              className="rounded-lg !static object-contain"
            />
          </div>
        </SwiperSlide>
        <SwiperSlide className="!h-auto">
          <Link href={"/tobacco/420"} className="relative rounded-lg">
            <Image
              src={"/images/slide-3.jpg"}
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              alt={"slider-pics"}
              className="rounded-lg !static object-contain"
            />
          </Link>
        </SwiperSlide>
      </Swiper>
    </section>
  );
};

export { MainSlider };
