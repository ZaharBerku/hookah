"use client";

import { List } from "@/compoents/atoms";
import { SectionName } from "@/compoents/molecules";
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
    <section className="flex flex-col gap-9 relative pt-2 md:pt-16">
      <div className="bg-opacity-40 absolute top-0 bg-light w-screen -z-10 -bottom-2 md:-bottom-15 -translate-x-1/2 left-1/2"></div>
      <SectionName content="Деталі товару" />
      {arrayDetails && (
        <div className="px-8 py-7 w-full rounded-3xl border border-secondary">
          <List
            className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-20"
          >
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
    </section>
  );
};

export { ProductDetailsSection };
