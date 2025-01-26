"use client";

import { Menu } from "@/componets/molecules";
import { Skeleton } from "@nextui-org/skeleton";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { MainSliderSkeleton } from "./MainSliderSkeleton";

const FirstSlide = dynamic(() => import("./FirstSlide"), {
  ssr: false,
  loading: () => <Skeleton className="aspect-[8/3] w-full rounded-lg mb-4" />
});

const SecondSlide = dynamic(() => import("./SecondSlide"), {
  ssr: false,
  loading: () => <Skeleton className="aspect-[8/3] w-full rounded-lg mb-4" />
});
const ThirdSlide = dynamic(() => import("./ThirdSlide"), {
  ssr: false,
  loading: () => <Skeleton className="aspect-[8/3] w-full rounded-lg mb-4" />
});

const MainSlider = () => {
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  useEffect(() => {
    const handlePageLoad = () => setIsPageLoaded(true);

    if (document.readyState === "complete") {
      handlePageLoad();
    } else {
      window.addEventListener("load", handlePageLoad);
    }

    return () => window.removeEventListener("load", handlePageLoad);
  }, []);

  if (!isPageLoaded) return <MainSliderSkeleton />;

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
        lazyPreloadPrevNext={2}
        spaceBetween={20}
        navigation={true}
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
