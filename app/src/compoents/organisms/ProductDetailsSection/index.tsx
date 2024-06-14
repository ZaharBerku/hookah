"use client";

import { List } from "@/compoents/atoms";
import { SectionName } from "@/compoents/molecules";
import { FC } from "react";

interface ProductDetailsSectionPorps {
  details: any;
  name: string;
}

const ProductDetailsSection: FC<ProductDetailsSectionPorps> = ({ details, name }) => {
  const mock = {
    "Дифузор шахти": "плаваючий борт шахти",
    "Об’єм колби кальяну": 50,
    "Об’єм колби кальяну 1": 50,
    "Об’єм колби кальяну 2": 50,
    "Об’єм колби кальяну 3": 50,
    "Об’єм колби кальяну 4": 50,
    "Об’єм колби кальяну 5": 50,
    "Об’єм колби кальяну 7": 50,
    "Об’єм колби кальяну 6": 50
  };
  const arrayDetails = details ? Object.entries(details) as [string, string][] : null;
  return (
    <section className="flex flex-col gap-9 relative pt-2 md:pt-16">
      <div className="bg-opacity-40 absolute top-0 bg-light w-screen -z-10 -bottom-2 md:-bottom-15 -translate-x-1/2 left-1/2"></div>
      <SectionName content="Деталі товару" name={name} />
      {arrayDetails && (
        <div className="px-8 py-7 w-full rounded-3xl border border-secondary">
          <List className="grid grid-cols-auto-fill-mobile md:grid-cols-auto-fill gap-y-6 gap-x-20">
            {arrayDetails?.map(([name, value], index: number) => {
              return (
                <List.Item
                  className="text-black flex-1 text-3xs flex items-center text-end justify-between gap-2 md:gap-6"
                  key={index}
                >
                  <span className="font-bold text-start">{name}</span>
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
