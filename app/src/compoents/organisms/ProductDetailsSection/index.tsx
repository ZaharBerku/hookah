"use client";

import { List } from "@/compoents/atoms";
import { FC } from "react";

import { DetailType } from "@/utils/types";

interface ProductDetailsSectionPorps {
  details: any;
  name: string;
}

const ProductDetailsSection: FC<ProductDetailsSectionPorps> = ({
  details,
  name
}) => {
  const arrayDetails = details ? (details as DetailType[]) : null;
  return (
    <>
      {arrayDetails && (
        <div className="px-8 py-7 w-full rounded-3xl border border-secondary">
          <List className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-20">
            {arrayDetails?.map(({ key, value }, index: number) => {
              return (
                <List.Item
                  className="text-black flex-1 text-3xs flex items-start text-end justify-between gap-2 md:gap-6"
                  key={index}
                >
                  <span className="font-bold text-start">{key}</span>
                  {value}
                </List.Item>
              );
            })}
          </List>
        </div>
      )}
    </>
  );
};

export { ProductDetailsSection };
