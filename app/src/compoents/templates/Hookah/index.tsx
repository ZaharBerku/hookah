"use client";

import {
  ProductOverviewWithGallerySection,
  ProductDetailsSection,
  WrapperProduct
} from "@/compoents/organisms";
import { FC } from "react";

interface HookahProps {
  data: any;
  loading?: boolean;
}

const Hookah: FC<HookahProps> = ({ data }) => {
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

export { Hookah };
