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
  const tRow = useTranslations("Home.Main.ProductRow");
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
        <div className="hidden shrink-0 gap-2 md:flex [@media(any-pointer:fine)]:flex">
          <PaginationButton
            handleClick={() => scrollRow(-1)}
            type="left"
            label={tRow("previous", { section: name })}
          />
          <PaginationButton
            handleClick={() => scrollRow(1)}
            type="right"
            label={tRow("next", { section: name })}
          />
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
