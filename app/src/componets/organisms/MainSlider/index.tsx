"use client";

import { Menu } from "@/componets/molecules";
import { Skeleton } from "@nextui-org/skeleton";
import dynamic from "next/dynamic";
import { type FC, useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import FirstSlide from "./FirstSlide";

const SecondSlide = dynamic(() => import("./SecondSlide"), {
  ssr: false,
  loading: () => <Skeleton className="aspect-[8/3] w-full rounded-lg mb-4" />
});

const ThirdSlide = dynamic(() => import("./ThirdSlide"), {
  ssr: false,
  loading: () => <Skeleton className="aspect-[8/3] w-full rounded-lg mb-4" />
});

interface IMainSliderProps {
  isMobile: boolean;
}

const MainSlider: FC<IMainSliderProps> = ({ isMobile }) => {
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

  return (
    <section className="flex gap-10 w-full relative">
      {!isMobile && (
        <div className="relative hidden lg:block max-w-74 w-full">
          <Menu
            classes={{ wrapper: "absolute min-w-74 z-20", list: "min-w-74" }}
          />
        </div>
      )}

      {!isPageLoaded && (
        <div className="aspect-[8/3] rounded-lg overflow-hidden">
          <FirstSlide isMobile={isMobile} />
        </div>
      )}

      {isPageLoaded && (
        <Swiper
          initialSlide={0}
          autoHeight
          slidesPerView={1}
          pagination={{ clickable: true }}
          loop
          autoplay={{
            delay: 5000,
            disableOnInteraction: false
          }}
          lazyPreloadPrevNext={2}
          spaceBetween={20}
          modules={[Autoplay, Pagination]}
          className="mySwiper"
        >
          <SwiperSlide className="aspect-[8/3]">
            <FirstSlide isMobile={isMobile} />
          </SwiperSlide>
          <SwiperSlide className="aspect-[8/3]">
            <SecondSlide />
          </SwiperSlide>
          <SwiperSlide className="aspect-[8/3]">
            <ThirdSlide />
          </SwiperSlide>
        </Swiper>
      )}
    </section>
  );
};

export default MainSlider;
