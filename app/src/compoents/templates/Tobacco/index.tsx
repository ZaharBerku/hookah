"use client";

import {
  ProductOverviewWithGallerySection,
  ProductDetailsSection,
  WrapperProduct
} from "@/compoents/organisms";
import { FC } from "react";

interface TobaccoProps {
  data: any;
  loading?: boolean;
}

const Tobacco: FC<TobaccoProps> = ({ data }) => {
  const { attributes } = data;
  return (
    <WrapperProduct data={data}>
      <ProductOverviewWithGallerySection data={data} />
      {attributes.details && (
        <ProductDetailsSection
          name={attributes.name}
          details={attributes.details}
        />
      )}
    </WrapperProduct>
  );
};

export { Tobacco };
