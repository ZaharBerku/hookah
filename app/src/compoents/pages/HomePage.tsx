"use client";

import { ProductSliderSection, MainSlider } from "@/compoents/organisms";
import { FC } from "react";

interface HomePagePorps {
  loading?: boolean;
  data?: any;
}

const HomePage: FC<HomePagePorps> = ({ loading, data }) => {
  return (
    <div className="flex flex-col gap-12 relative">
      <MainSlider />
      <ProductSliderSection name="Топ товарів" content="Сьогодні" data={data} />
      <ProductSliderSection name="Новинки" content="Огляд новинок" data={data} />
      <ProductSliderSection
        name="Акції"
        content="Акційний  пропозиції"
        data={data}
      />
    </div>
  );
};

export { HomePage };
