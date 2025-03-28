"use client";

import { Button } from "@/componets/atoms";
import { SectionName, PaginationButton } from "@/componets/molecules";
import { WrapperActionsProduct } from "@/hoc";
import { useTranslations } from "next-intl";
import { type FC, useCallback, useEffect, useRef, useState } from "react";

import { ProductSlider } from "../ProductSlider";
import { PreLoadProductSlider } from "../ProductSlider/PreLoadProductSlider";

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
          {isPageLoaded ? (
            <ProductSlider data={data} forwardRef={sliderRef} />
          ) : (
            <PreLoadProductSlider data={data.slice(0, 4)} />
          )}
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
