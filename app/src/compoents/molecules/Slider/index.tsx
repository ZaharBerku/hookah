"use client";

import clsx from "clsx";
import React, { FC, useRef, useEffect } from "react";

interface SliderProps {
  min: number;
  max: number;
  step: number;
  initial: string;
  label: string;
  taste: "sour" | "spicy" | "freshness" | "sweetness";
}

const gradientTaste = {
  sour: "bg-gradient-sour border-sour",
  spicy: "bg-gradient-spicy border-spicy",
  freshness: "bg-gradient-freshness border-freshness",
  sweetness: "bg-gradient-sweetness border-sweetness"
};

const textTaste = {
  sour: "text-sour",
  spicy: "text-spicy",
  freshness: "text-freshness",
  sweetness: "text-sweetness"
};

const thumbTaste = {
  sour: "bg-sour",
  spicy: "bg-spicy",
  freshness: "bg-freshness",
  sweetness: "bg-sweetness"
};

const Slider: FC<SliderProps> = ({ min, max, step, initial, label, taste }) => {
  const rangeRef = useRef<any>(null);
  const thumbRef = useRef<any>(null);

  const updateThumbPosition = () => {
    const range = rangeRef.current;
    const thumb = thumbRef.current;
    const rangeWidth = range.clientWidth;
    const thumbWidth = thumb.clientWidth;
    const max = range.max;
    const min = range.min;
    const value = range.value;
    const percentage = (value - min) / (max - min);
    const offset = (rangeWidth - thumbWidth) * percentage;

    thumb.style.left = `${offset}px`;
  };

  useEffect(() => {
    const range = rangeRef.current;
    if (range) {
      range.addEventListener("input", updateThumbPosition);
      updateThumbPosition(); // Initial position

      return () => {
        range.removeEventListener("input", updateThumbPosition);
      };
    }
  }, [rangeRef.current]);

  return (
    <div className="w-full px-4 py-2">
      <label
        className={clsx(
          "text-brown-800 font-bold mb-2 block",
          textTaste[taste]
        )}
      >
        {label}
      </label>
      <input
        disabled={true}
        className={clsx(
          "custom-range relative flex justify-evenly before:border-r after:border-l before:border-inherit after:border-inherit before:h-full after:h-full after:flex-1 before:flex-1 rounded-3xl border overflow-hidden appearance-none h-4 w-full max-w-96",
          gradientTaste[taste]
        )}
        type="range"
        ref={rangeRef}
        min={min}
        max={max}
        step={step}
        defaultValue={initial}
      />
      <div
        className={clsx("thumb mt-1.5", thumbTaste[taste])}
        ref={thumbRef}
      ></div>
    </div>
  );
};

export { Slider };
