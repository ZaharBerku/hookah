"use client";

import clsx from "clsx";
import { FC } from "react";

interface DescriptionProductProps {
  text?: string;
  className?: string;
}

const DescriptionProduct: FC<DescriptionProductProps> = ({
  text,
  className
}) => {
  if (!text) {
    return null;
  }
  return (
    <p
      className={clsx(
        "text-3xs text-black text-opacity-60 font-normal",
        className
      )}
    >
      {text}
    </p>
  );
};

export { DescriptionProduct };
