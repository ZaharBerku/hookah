import { Card } from "@/compoents/organisms";
import { FC } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

interface ProductProps {
  data: any;
  forwardRef: any;
}

const settings = {
  dots: false,
  infinite: true,
  autoplay: true,
  autoplaySpeed: 3000,
  pauseOnHover: true,
  slidesToShow: 4,
  slidesToScroll: 4,
  responsive: [
    {
      breakpoint: 980,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 4
      }
    },
    {
      breakpoint: 840,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3
      }
    },
    {
      breakpoint: 640,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        autoplay: false
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        autoplay: false
      }
    },
    {
      breakpoint: 320,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        autoplay: false
      }
    }
  ]
};

const Product: FC<ProductProps> = (props) => {
  return (
    <div className="slider-container">
      <Slider
        ref={(slider) => {
          props.forwardRef.current = slider;
        }}
        {...settings}
      >
        {props.data.map((card: any) => {
          return (
            <div key={card.id} className="px-2 lg:px-2.5">
              <Card card={card} />
            </div>
          );
        })}
      </Slider>
    </div>
  );
};

export default Product;
