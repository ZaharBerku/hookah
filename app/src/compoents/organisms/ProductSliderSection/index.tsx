"use client";

import { Button, Icon } from "@/compoents/atoms";
import { SectionName } from "@/compoents/molecules";
import { WrapperActionsProduct } from "@/hoc";
import dynamic from "next/dynamic";
import { FC, useCallback, useRef } from "react";
import "swiper/css";
import "swiper/css/pagination";

import { ProductSliderSkeleton } from "../ProductSlider/ProductSliderSkeleton";

const ProductSlider = dynamic(() => import("../ProductSlider"), {
  ssr: false,
  loading: () => <ProductSliderSkeleton />
});

interface ProductSliderSectionProps {
  data: any;
  name: string;
  content: string;
}

const ProductSliderSection: FC<ProductSliderSectionProps> = ({
  data,
  name,
  content
}) => {
  const sliderRef = useRef<any>(null);

  const handlePrev = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current?.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current?.swiper.slideNext();
  }, []);

  return (
    <section className="flex flex-col w-full gap-8 md:gap-14 relative">
      <div className="flex justify-between items-center">
        <SectionName name={name} content={content} />
        <div className="hidden md:flex gap-2">
          <Button
            onClick={handlePrev}
            className="flex justify-center items-center !bg-custom-accent-base min-w-11 h-11 rounded-full"
            color="transparent"
          >
            <Icon
              type="ArrowRightIcon"
              className="w-6 h-5 rotate-180 stroke-black"
            />
          </Button>
          <Button
            onClick={handleNext}
            className="flex justify-center items-center !bg-custom-accent-base min-w-11 h-11 rounded-full"
            color="transparent"
          >
            <Icon type="ArrowRightIcon" className="w-6 h-5 stroke-black" />
          </Button>
        </div>
      </div>
      {Boolean(data?.length) && (
        <WrapperActionsProduct>
          <ProductSlider data={data} forwardRef={sliderRef} />
        </WrapperActionsProduct>
      )}
      <Button
        className="md:max-w-49 w-full self-end !h-12 md:!h-10"
        color="second"
      >
        Дивитись всі
      </Button>
    </section>
  );
};

export { ProductSliderSection };
