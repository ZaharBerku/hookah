"use client";

import { RadioButton } from "@/compoents/atoms";
import clsx from "clsx";
import { ChangeEvent, FC, useState } from "react";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

interface ColorsProps {
  colors: string[];
  disabled?: boolean;
}

const Colors: FC<ColorsProps> = ({ colors, disabled }) => {
  const [selectColor, setSelectColor] = useState<string | null>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectColor(event.target.value);
  };

  const isChecked = (value: string) => selectColor === value;
  return (
    <div data-color={"color"} className="overflow-hidden">
      <Swiper
        slidesPerView={6}
        loop={true}
        breakpoints={{
          640: {
            slidesPerView: 7,
          },
        }}
        watchOverflow={true}
        grabCursor={true}
        observeParents
        observer={true}
        modules={[Pagination]}
        className="mySwiper !w-[110%]"
      >
        {colors.map((color, index) => {
          return (
            <SwiperSlide className="!bg-transparent" key={index}>
              <RadioButton
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
              >
                <span
                  style={{
                    backgroundColor: color
                  }}
                  className="w-7 h-7 md:w-9 md:h-9 block border border-black border-opacity-20 rounded-full"
                ></span>
              </RadioButton>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export { Colors };
