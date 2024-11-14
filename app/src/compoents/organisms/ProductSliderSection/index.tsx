"use client";

import { Button } from "@/compoents/atoms";
import { SectionName, PaginationButton } from "@/compoents/molecules";
import { WrapperActionsProduct } from "@/hoc";
import { Skeleton } from "@nextui-org/skeleton";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { FC, useCallback, useEffect, useRef, useState } from "react";

import { ProductSliderSkeleton } from "../ProductSlider/ProductSliderSkeleton";

const ProductSlider = dynamic(() => import("../ProductSlider"), {
  ssr: false,
  loading: () => <ProductSliderSkeleton />
});

interface ProductSliderSectionProps {
  data: any;
  name: string;
  content: string;
  href: string;
}

const ProductSliderSection: FC<ProductSliderSectionProps> = ({
  data,
  name,
  content,
  href
}) => {
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  const t = useTranslations("Button.All");
  const sliderRef = useRef<any>(null);

  const handlePrev = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current?.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current?.swiper.slideNext();
  }, []);

  useEffect(() => {
    const handlePageLoad = () => setIsPageLoaded(true);

    if (document.readyState === "complete") {
      handlePageLoad();
    } else {
      window.addEventListener("load", handlePageLoad);
    }

    return () => window.removeEventListener("load", handlePageLoad);
  }, []);

  if (isPageLoaded)
    return (
      <section className="flex flex-col w-full gap-8 md:gap-14 relative">
        <div className="flex justify-between items-center">
          <Skeleton className="h-20 w-28 rounded-md" />
        </div>
        <ProductSliderSkeleton />;
      </section>
    );

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

export { ProductSliderSection };
