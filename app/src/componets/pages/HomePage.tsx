"use client";

import { ProductSliderSection } from "@/componets/organisms";
import { useTranslations } from "next-intl";
import { FC } from "react";
import MainSlider from "../organisms/MainSlider";

interface HomePagePorps {
  loading?: boolean;
  data?: any;
}


const HomePage: FC<HomePagePorps> = ({ data }) => {
  const { discountProducts, newProducts, topProducts } = data;
  const t = useTranslations("Home.Main.Sections");
  return (
    <div className="flex flex-col gap-12 relative">
      <MainSlider />
    
      <ProductSliderSection
        name={t("Top.name")}
        content={t("Top.content")}
        data={topProducts.data}
        href="/top-products"
      />

      <ProductSliderSection
        name={t("New.name")}
        content={t("New.content")}
        data={newProducts.data}
        href="/new-products"
      />

      <ProductSliderSection
        name={t("Discount.name")}
        content={t("Discount.content")}
        data={discountProducts.data}
        href="/discount-products"
      />
    </div>
  );
};

export { HomePage };
