"use client";

import { Tobacco } from "@/compoents/templates";
import { FC } from "react";

interface TobaccoProductPagePorps {
  data: any;
  loading: boolean;
}

const TobaccoProductPage: FC<TobaccoProductPagePorps> = ({ data, loading }) => {
  if (loading) {
    return null;
  }
  return (
    <div className="w-full h-full">
      <Tobacco data={data} />
    </div>
  );
};

export { TobaccoProductPage };
