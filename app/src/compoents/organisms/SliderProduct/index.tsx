import { Card } from "@/compoents/organisms";
import { forwardRef } from "react";
import { Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";

interface SliderProductProps {
  data: any;
}

const SliderProduct = forwardRef<SwiperRef, SliderProductProps>(
  (props, ref) => {
    return (
      <Swiper
        slidesPerView={"auto"}
        loop={true}
        ref={ref}
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
        modules={[Autoplay, Pagination]}
        className="mySwiper"
      >
        {props.data.map((card: any) => {
          return (
            <SwiperSlide key={card.id}>
              <Card card={card} />
            </SwiperSlide>
          );
        })}
      </Swiper>
    );
  }
);

SliderProduct.displayName = "SliderProduct";

export default SliderProduct;