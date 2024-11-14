import dynamic from "next/dynamic";
import { FC } from "react";
import { Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { CardSkeleton } from "../CardSkeleton";

const Card = dynamic(() => import("../../organisms/Card"), {
  ssr: false,
  loading: () => <CardSkeleton />
});

interface ProductProps {
  data: any;
  forwardRef: any;
}
const Product: FC<ProductProps> = (props) => {
  return (
    <Swiper
      slidesPerView={"auto"}
      ref={props.forwardRef}
      autoplay={{
        delay: 2000,
        pauseOnMouseEnter: true,
        disableOnInteraction: false
      }}
      lazyPreloadPrevNext={5}
      breakpoints={{
        320: {
          slidesPerView: 2,
          spaceBetween: 16,
          autoplay: false,
          loop: props?.data?.length >= 3
        },
        480: {
          slidesPerView: 3,
          spaceBetween: 16,
          autoplay: false,
          loop: props?.data?.length >= 4
        },
        640: {
          slidesPerView: 3,
          spaceBetween: 16,
          autoplay: false,
          loop: props?.data?.length >= 4
        },
        840: {
          slidesPerView: 3,
          spaceBetween: 20,
          loop: props?.data?.length >= 4
        },
        980: {
          slidesPerView: 4,
          spaceBetween: 20,
          loop: props?.data?.length >= 5
        }
      }}
      modules={[Autoplay, Pagination]}
      className="mySwiper"
    >
      {props.data.map((card: any) => {
        return (
          <SwiperSlide className="!h-auto" key={card.id}>
            <Card card={card} />
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default Product;
