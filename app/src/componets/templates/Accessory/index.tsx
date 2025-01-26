"use client";

import {
  ProductOverviewWithGallerySection,
  WrapperProduct
} from "@/componets/organisms";
import { GET_ACCESSORY_BY_PRODUCT_OD_ID_QUERY } from "@/query/accessory";
import { FC } from "react";

interface AccessoryProps {
  data: any;
  loading?: boolean;
}

const Accessory: FC<AccessoryProps> = ({ data }) => {
  return (
    <WrapperProduct data={data}>
      <ProductOverviewWithGallerySection
        data={data}
        query={GET_ACCESSORY_BY_PRODUCT_OD_ID_QUERY}
      />
    </WrapperProduct>
  );
};

export { Accessory };
