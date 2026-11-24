"use client";

import { Menu } from "@/componets/molecules";
import { useTranslations } from "next-intl";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import FirstSlide from "./FirstSlide";
import SecondSlide from "./SecondSlide";
import ThirdSlide from "./ThirdSlide";

const MainSlider = () => {
  const t = useTranslations("Home.Main.Hero");
  return (
    <section className="flex gap-10 w-full relative">
      <div className="relative hidden lg:block max-w-74 w-full">
        <Menu
          classes={{ wrapper: "absolute min-w-74 z-20", list: "min-w-74" }}
        />
      </div>

      <Swiper
        initialSlide={0}
        autoHeight
        slidesPerView={1}
        pagination={{ clickable: true, bulletElement: "button" }}
        onPaginationUpdate={(swiper) => {
          swiper.pagination.bullets.forEach((bullet, index) => {
            bullet.setAttribute("type", "button");
            bullet.setAttribute(
              "aria-label",
              t("goToSlide", { slide: index + 1 })
            );
            if (index === swiper.realIndex) {
              bullet.setAttribute("aria-current", "true");
            } else {
              bullet.removeAttribute("aria-current");
            }
          });
        }}
        loop
        autoplay={{
          delay: 5000,
          disableOnInteraction: false
        }}
        spaceBetween={20}
        modules={[Autoplay, Pagination]}
        className="mySwiper"
      >
        <SwiperSlide className="aspect-[8/3]">
          <FirstSlide />
        </SwiperSlide>
        <SwiperSlide className="aspect-[8/3]">
          <SecondSlide />
        </SwiperSlide>
        <SwiperSlide className="aspect-[8/3]">
          <ThirdSlide />
        </SwiperSlide>
      </Swiper>
    </section>
  );
};

export default MainSlider;
