"use client";

import {
  ProductOverviewWithGallerySection,
  WrapperProduct
} from "@/componets/organisms";
import { FC } from "react";

interface TobaccoProps {
  data: any;
  loading?: boolean;
}

const Tobacco: FC<TobaccoProps> = ({ data }) => {
  return (
    <WrapperProduct data={data}>
      <ProductOverviewWithGallerySection data={data} />
    </WrapperProduct>
  );
};

export { Tobacco };
