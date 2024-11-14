"use client";

import { ProductSliderSection } from "@/compoents/organisms";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { FC } from "react";
import "swiper/css";
import { MainSliderSkeleton } from "../organisms/MainSlider/MainSliderSkeleton";

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
      {Boolean(topProducts.data.length) && (
        <ProductSliderSection
          name={t("Top.name")}
          content={t("Top.content")}
          data={topProducts.data}
          href="/top-products"
        />
      )}
      {Boolean(newProducts.data.length) && (
        <ProductSliderSection
          name={t("New.name")}
          content={t("New.content")}
          data={newProducts.data}
          href="/new-products"
        />
      )}
      {Boolean(discountProducts.data.length) && (
        <ProductSliderSection
          name={t("Discount.name")}
          content={t("Discount.content")}
          data={discountProducts.data}
          href="/discount-products"
        />
      )}
    </div>
  );
};

export { HomePage };
