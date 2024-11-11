"use client";

import { ProductSliderSectionTest, MainSliderTest } from "@/compoents/organisms";
import { useTranslations } from "next-intl";
import { FC } from "react";

interface HomePageTestPorps {
  loading?: boolean;
  data?: any;
}

const HomePageTest: FC<HomePageTestPorps> = ({ data }) => {
  const { discountProducts, newProducts, topProducts } = data;
  const t = useTranslations("Home.Main.Sections");
  return (
    <div className="flex flex-col gap-12 relative">
      <MainSliderTest />
      {Boolean(topProducts.data.length) && (
        <ProductSliderSectionTest
          name={t("Top.name")}
          content={t("Top.content")}
          data={topProducts.data}
          href="/top-products"
        />
      )}
      {Boolean(newProducts.data.length) && (
        <ProductSliderSectionTest
          name={t("New.name")}
          content={t("New.content")}
          data={newProducts.data}
          href="/new-products"
        />
      )}
      {Boolean(discountProducts.data.length) && (
        <ProductSliderSectionTest
          name={t("Discount.name")}
          content={t("Discount.content")}
          data={discountProducts.data}
          href="/discount-products"
        />
      )}
    </div>
  );
};

export { HomePageTest };
