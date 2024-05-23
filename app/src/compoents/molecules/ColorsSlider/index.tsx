"use client";

import { Color } from "@/compoents/molecules";
import clsx from "clsx";
import { ChangeEvent, FC, useState } from "react";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

interface ColorsSliderProps {
  colors: any;
  disabled?: boolean;
}

const ColorsSlider: FC<ColorsSliderProps> = ({ colors, disabled }) => {
  const [selectColor, setSelectColor] = useState<string | null>(null);
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectColor(event.target.value);
  };

  const NUMBER_OF_PRE_VIEW = 6;

  const isChecked = (value: string) => selectColor === value;
  return (
    <div data-color={"color"} className="overflow-hidden">
      <Swiper
        slidesPerView={NUMBER_OF_PRE_VIEW}
        loop={colors.length >= NUMBER_OF_PRE_VIEW}
        breakpoints={{
          640: {
            slidesPerView: 7
          }
        }}
        spaceBetween={5}
        watchOverflow={true}
        grabCursor={true}
        observeParents
        observer={true}
        modules={[Pagination]}
        className="mySwiper !w-[110%]"
      >
        {colors?.at(0)?.color.map((color: any, index: number) => {
          return (
            <SwiperSlide className="!bg-transparent" key={index}>
              <Color
                disabled={disabled}
                onChange={handleChange}
                value={color}
                name={"color"}
                classes={{
                  label: clsx("cursor-pointer", {
                    "cursor-grab": disabled
                  })
                }}
                checked={isChecked(color)}
                color={color}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export { ColorsSlider };
