"use client";

import { Button } from "@/compoents/atoms";
import { SectionName } from "@/compoents/molecules";
import { WrapperActionsProduct } from "@/hoc";
import { useTranslations } from "next-intl";
import { FC } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

import { Card } from "../Card";

interface ProductSliderSectionTestProps {
  data: any;
  name: string;
  content: string;
  href: string;
}

const ProductSliderSectionTest: FC<ProductSliderSectionTestProps> = ({
  data,
  name,
  content,
  href
}) => {
  const t = useTranslations("Button.All");
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 3
  };

  return (
    <section className="flex flex-col w-full gap-8 md:gap-14 relative">
      <div className="flex justify-between items-center">
        <SectionName name={name} content={content} />
        {/* <div className="hidden md:flex gap-2">
          <PaginationButton handleClick={handlePrev} type="left" />
          <PaginationButton handleClick={handleNext} type="right" />
        </div> */}
      </div>
      {Boolean(data?.length) && (
        <WrapperActionsProduct>
          <div className="slider-container">
            <Slider {...settings}>
              {data.map((card: any) => {
                return (
                  <div key={card.id}>
                    <Card card={card} />
                  </div>
                );
              })}
            </Slider>
          </div>
        </WrapperActionsProduct>
      )}
      <Button
        className="md:max-w-49 w-full self-end !h-12 md:!h-10"
        color="second"
        as="link"
        href={href}
      >
        {t("text")}
      </Button>
    </section>
  );
};

export { ProductSliderSectionTest };
