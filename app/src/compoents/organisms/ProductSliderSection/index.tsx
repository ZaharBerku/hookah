"use client";

import { SectionName, PaginationButton } from "@/compoents/molecules";
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
          <PaginationButton handleClick={handlePrev} type="left" />
          <PaginationButton handleClick={handleNext} type="right" />
        </div>
      </div>
      {Boolean(data?.length) && (
        <WrapperActionsProduct>
          <ProductSlider data={data} forwardRef={sliderRef} />
        </WrapperActionsProduct>
      )}
    </section>
  );
};

export { ProductSliderSection };
