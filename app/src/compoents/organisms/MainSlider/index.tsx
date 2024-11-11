"use client";

import { Menu } from "@/compoents/molecules";
import { Skeleton } from "@nextui-org/skeleton";
import Image from "next/image";
import { useState, useEffect } from "react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { Link } from "@/utils/navigation";

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

  if (!isPageLoaded)
    return (
      <section className="flex gap-10 w-full relative">
        <div className="hidden md:block relative max-w-74 w-full">
          <Skeleton className="h-48 w-full rounded-lg" />
        </div>
        <div className="flex-1">
          <Skeleton className="h-48 w-full rounded-lg mb-4" />
        </div>
      </section>
    );

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
        <SwiperSlide className="aspect-[8/3]">
          <Link href={"/tobacco/420"} className="relative rounded-lg">
            <Image
              src={"/images/slide-1.jpg"}
              fill
              loading="lazy"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              alt={"slider-pics"}
              className="rounded-lg !static object-contain"
            />
          </Link>
        </SwiperSlide>
        <SwiperSlide className="aspect-[8/3]">
          <Link href={"/tobacco/yummy"} className="relative rounded-lg">
            <Image
              src={"/images/slide-2.jpg"}
              fill
              loading="lazy"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              alt={"slider-pics"}
              className="rounded-lg !static object-contain"
            />
          </Link>
        </SwiperSlide>
        <SwiperSlide className="aspect-[8/3]">
          <Link href={"/tobacco/unity"} className="relative rounded-lg">
            <Image
              src={"/images/slide-3.jpg"}
              fill
              loading="lazy"
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
