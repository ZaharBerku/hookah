"use client";

import { ProductSliderSection, MainSlider } from "@/compoents/organisms";
import { useTranslations } from "next-intl";
import { FC } from "react";

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
      {Boolean(topProducts.data.length) && (
        <ProductSliderSection
          name={t("Top.name")}
          content={t("Top.content")}
          data={topProducts.data}
        />
      )}
      {Boolean(newProducts.data.length) && (
        <ProductSliderSection
          name={t("New.name")}
          content={t("New.content")}
          data={newProducts.data}
        />
      )}
      {Boolean(discountProducts.data.length) && (
        <ProductSliderSection
          name={t("Discount.name")}
          content={t("Discount.content")}
          data={discountProducts.data}
        />
      )}
    </div>
  );
};

export { HomePage };
