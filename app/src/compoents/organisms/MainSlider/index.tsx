"use client";

import { Menu } from "@/compoents/molecules";
import { Skeleton } from "@nextui-org/skeleton";
import Image from "next/image";
import { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { Link } from "@/utils/navigation";

const settings = {
  dots: true,
  infinite: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  pauseOnHover: true
};

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
    <section className="flex gap-10 w-full relative justify-between">
      <div className="hidden md:block relative max-w-74 w-full">
        <Menu
          classes={{ wrapper: "absolute min-w-74 z-20", list: "min-w-74" }}
        />
      </div>
      <div className="slider-container flex-[70%] max-w-full md:max-w-[calc(100%-320px)] w-full">
        <Slider {...settings}>
          <div className="w-full h-full aspect-[8/3] px-2.5">
            <Link href={"/tobacco/420"} className="relative rounded-lg">
              <Image
                src={"/images/slide-1.jpg"}
                fill
                loading="lazy"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                alt={"slider-pics"}
                className="rounded-lg !static object-cover"
              />
            </Link>
          </div>
          <div className="w-full h-full aspect-[8/3] px-2.5">
            <Link href={"/tobacco/yummy"} className="relative rounded-lg">
              <Image
                src={"/images/slide-2.jpg"}
                fill
                loading="lazy"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                alt={"slider-pics"}
                className="rounded-lg !static object-cover"
              />
            </Link>
          </div>
          <div className="w-full h-full aspect-[8/3] px-2.5">
            <Link href={"/tobacco/unity"} className="relative rounded-lg">
              <Image
                src={"/images/slide-3.jpg"}
                fill
                loading="lazy"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                alt={"slider-pics"}
                className="rounded-lg !static object-cover"
              />
            </Link>
          </div>
        </Slider>
      </div>
    </section>
  );
};

export { MainSlider };
