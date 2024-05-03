"use client";

import { Button, Icon } from "@/compoents/atoms";
import { SectionName } from "@/compoents/molecules";
import dynamic from "next/dynamic";
import { FC, useCallback, useRef, MouseEvent } from "react";
import "swiper/css";
import "swiper/css/pagination";

import { useStores } from "@/hooks";
import { useRouter } from "@/utils/navigation";

import { SliderProductSkeleton } from "../SliderProduct/SliderProductSkeleton";

const SliderProduct = dynamic(() => import("../SliderProduct"), {
  ssr: false,
  loading: () => <SliderProductSkeleton />
});

interface ProductSectionProps {
  data: any;
  name: string;
  content: string;
}

const ProductSection: FC<ProductSectionProps> = ({ data, name, content }) => {
  const sliderRef = useRef<any>(null);
  const router = useRouter();
  const { cart } = useStores();

  const handlePrev = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current?.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current?.swiper.slideNext();
  }, []);

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    const cardElement = (event.target as HTMLDivElement)?.closest(
      "[data-card]"
    );
    const colorElement = (event.target as HTMLDivElement)?.closest(
      "[data-color]"
    );
    const buttonBuy = (event.target as HTMLDivElement)?.closest(
      "[data-product]"
    );

    if (buttonBuy) {
      const product = (buttonBuy as any)?.dataset.product;
      cart.addProductToCart(JSON.parse(product));
    } else if (cardElement && !colorElement) {
      const card = JSON.parse((cardElement as any)?.dataset.card);
      router.push(`/${card.name}?productId=${card.id}`);
    }
  };

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
        <div onClick={handleClick}>
          <SliderProduct data={data} forwardRef={sliderRef} />
        </div>
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

export { ProductSection };
