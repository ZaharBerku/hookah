"use client";

// import { Menu } from "@/compoents/molecules";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

import { Link } from "@/utils/navigation";

const settings = {
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1
};
const MainSliderTest = () => {
  return (
    // <section className="flex gap-10 w-full">
    //   <div className="hidden md:block relative max-w-74 w-full">
    //     <Menu
    //       classes={{ wrapper: "absolute min-w-74 z-20", list: "min-w-74" }}
    //     />
    //   </div>
      <div className="slider-container">
        <Slider {...settings}>
          <div>
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
          </div>
          <div>
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
          </div>
          <div>
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
          </div>
        </Slider>
      </div>
  );
};

export { MainSliderTest };
