import dynamic from "next/dynamic";
import { FC } from "react";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { CardSkeleton } from "../CardSkeleton";

const Card = dynamic(() => import("../Card"), {
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
      breakpoints={{
        320: {
          slidesPerView: 2,
          spaceBetween: 16
        },
        480: {
          slidesPerView: 3,
          spaceBetween: 16
        },
        640: {
          slidesPerView: 3,
          spaceBetween: 16
        },
        840: {
          slidesPerView: 3,
          spaceBetween: 20
        },
        980: {
          slidesPerView: 4,
          spaceBetween: 20
        }
      }}
      modules={[Pagination]}
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
