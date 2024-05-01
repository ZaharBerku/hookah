import { Card } from "@/compoents/organisms";
import { FC } from "react";
import { Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

interface SliderProductProps {
  data: any;
  forwardRef: any;
}

const SliderProduct: FC<SliderProductProps> = (props) => {
  return (
    <Swiper
      slidesPerView={"auto"}
      loop={true}
      ref={props.forwardRef}
      autoplay={{
        delay: 2000,
        pauseOnMouseEnter: true,
        disableOnInteraction: false
      }}
      breakpoints={{
        320: {
          slidesPerView: 2,
          spaceBetween: 16,
          autoplay: false,
        },
        480: {
          slidesPerView: 3,
          spaceBetween: 16,
          autoplay: false,
        },
        640: {
          slidesPerView: 3,
          spaceBetween: 16,
          autoplay: false,
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
};

export default SliderProduct;
