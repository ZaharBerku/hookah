"use client";

import { useFormikContext } from "formik";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import React, { FC } from "react";

type SliderBarProps = {
  min: number;
  max: number;
  value?: number[];
  classes?: any;
  tabIndex?: number;
  disabled?: boolean;
  name?: string;
};

const formatPrice = (num: number) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  }
  return num.toString();
};

const SliderBar: FC<SliderBarProps> = ({
  classes = {},
  min,
  max,
  value,
  disabled,
  tabIndex,
  name
}) => {
  const { setFieldValue, values }: any = useFormikContext();
  const currentValue = values?.price?.between ? values?.price?.between : value;
  const handleChange = (data: number | number[]) => {
    if (name) {
      setFieldValue(name, data);
    }
  };

  return (
    <div className="flex pt-12 pb-1 px-2 justify-start items-center">
      <Slider
        range
        tabIndex={tabIndex}
        onChange={handleChange}
        value={currentValue}
        disabled={disabled}
        pushable={true}
        min={min}
        max={max}
        defaultValue={value}
        className={"p-0"}
        railStyle={{
          backgroundColor: "#E6EAF0",
          height: "3px",
          borderRadius: "5px"
        }}
        trackStyle={{
          backgroundColor: "#243656",
          height: "3px",
          borderRadius: "0px"
        }}
        handleStyle={
          {
            ["--before-text-1"]: `"${formatPrice(currentValue?.at(0))}"`,
            ["--before-text-2"]: `"${formatPrice(currentValue?.at(1))}"`
          } as any
        }
        dotStyle={{ border: "none", backgroundColor: "transparent" }}
      />
    </div>
  );
};

export { SliderBar };
