"use client";

import { RadioButton } from "@/compoents/atoms";
import clsx from "clsx";
import { ChangeEvent, FC, useState } from "react";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

interface ColorsProps {
  colors: any;
  disabled?: boolean;
}

const Color = ({ colors, disabled, handleChange, isChecked }: any) => {
  console.log(colors, "colors");
  return (
    <>
      {colors.map((color: any, index: number) => {
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
    </>
  );
};

const Colors: FC<ColorsProps> = ({ colors, disabled }) => {
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
