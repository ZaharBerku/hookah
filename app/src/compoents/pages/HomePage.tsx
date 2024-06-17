"use client";

import { ProductSliderSection, MainSlider } from "@/compoents/organisms";
import { FC } from "react";

interface HomePagePorps {
  loading?: boolean;
  data?: any;
}

const HomePage: FC<HomePagePorps> = ({ loading, data }) => {
  const { discountProducts, newProducts, topProducts } = data;
  return (
    <div className="flex flex-col gap-12 relative">
      <MainSlider />
      {Boolean(topProducts.data.length) && (
        <ProductSliderSection
          name="Топ товарів"
          content="Сьогодні"
          data={topProducts.data}
        />
      )}
      {Boolean(newProducts.data.length) && (
        <ProductSliderSection
          name="Новинки"
          content="Огляд новинок"
          data={newProducts.data}
        />
      )}
      {Boolean(discountProducts.data.length) && (
        <ProductSliderSection
          name="Акції"
          content="Акційний  пропозиції"
          data={discountProducts.data}
        />
      )}
    </div>
  );
};

export { HomePage };
