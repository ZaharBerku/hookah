"use client";

import {
  ProductOverviewWithGallerySection,
  ProductDetailsSection
} from "@/compoents/organisms";
import { FC } from "react";

interface TobaccoProps {
  data: any;
  loading?: boolean;
}

const Tobacco: FC<TobaccoProps> = ({ data }) => {
  const { attributes } = data;
  return (
    <div className="relative flex flex-col gap-16">
      <ProductOverviewWithGallerySection data={data} />
      {attributes.details && (
        <ProductDetailsSection
          name={attributes.name}
          details={attributes.details}
        />
      )}
    </div>
  );
};

export { Tobacco };
