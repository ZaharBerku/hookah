"use client";

import { Button } from "@/componets/atoms";
import { SectionName, PaginationButton } from "@/componets/molecules";
import { WrapperActionsProduct } from "@/hoc";
import { useTranslations } from "next-intl";
import { type FC, useCallback, useRef } from "react";

import { ProductRow } from "../ProductRow";

interface ProductSliderSectionProps {
  data: any;
  name: string;
  content: string;
  href: string;
}

const ProductSliderSection: FC<ProductSliderSectionProps> = ({
  data,
  name,
  content,
  href
}) => {
  const t = useTranslations("Button.All");
  const rowRef = useRef<HTMLUListElement>(null);

  const scrollRow = useCallback((direction: 1 | -1) => {
    const row = rowRef.current;
    if (!row) return;
    row.scrollBy({ left: direction * row.clientWidth, behavior: "smooth" });
  }, []);

  return (
    <section className="flex flex-col w-full gap-8 md:gap-14 relative">
      <div className="flex justify-between items-center">
        <SectionName name={name} content={content} />
        <div className="hidden md:flex gap-2">
          <PaginationButton handleClick={() => scrollRow(-1)} type="left" />
          <PaginationButton handleClick={() => scrollRow(1)} type="right" />
        </div>
      </div>
      {Boolean(data?.length) && (
        <WrapperActionsProduct>
          <ProductRow data={data} rowRef={rowRef} />
        </WrapperActionsProduct>
      )}
      <Button
        className="md:max-w-49 w-full self-end !h-12 md:!h-10"
        color="second"
        as="link"
        href={href}
      >
        {t("text")}
      </Button>
    </section>
  );
};

export { ProductSliderSection };
