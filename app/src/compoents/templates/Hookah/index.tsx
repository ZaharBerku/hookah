"use client";

import {
  ProductOverviewWithGallerySection,
  WrapperProduct
} from "@/compoents/organisms";
import { FC } from "react";

interface HookahProps {
  data: any;
  loading?: boolean;
}

const Hookah: FC<HookahProps> = ({ data }) => {
  return (
    <WrapperProduct data={data}>
      <ProductOverviewWithGallerySection data={data} />
    </WrapperProduct>
  );
};

export { Hookah };
