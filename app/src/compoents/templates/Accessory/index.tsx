"use client";

import {
  ProductOverviewWithGallerySection,
  WrapperProduct
} from "@/compoents/organisms";
import { FC } from "react";

interface AccessoryProps {
  data: any;
  loading?: boolean;
}

const Accessory: FC<AccessoryProps> = ({ data }) => {
  return (
    <WrapperProduct data={data}>
      <ProductOverviewWithGallerySection data={data} />
    </WrapperProduct>
  );
};

export { Accessory };
