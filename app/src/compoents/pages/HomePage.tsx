"use client";

import { ProductSliderSection } from "@/compoents/organisms";
import { MainSliderSkeleton } from "@/compoents/organisms/MainSlider/MainSliderSkeleton";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { FC } from "react";

interface HomePagePorps {
  loading?: boolean;
  data?: any;
}

const MainSlider = dynamic(() => import("../organisms/MainSlider"), {
  ssr: false,
  loading: () => <MainSliderSkeleton />
});

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
