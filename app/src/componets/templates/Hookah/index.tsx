"use client";

import {
  ProductOverviewWithGallerySection,
  WrapperProduct
} from "@/componets/organisms";
import { GET_HOOKAHS_BY_PRODUCT_OD_ID_QUERY } from "@/query/hookah";
import { FC } from "react";

interface HookahProps {
  data: any;
  loading?: boolean;
}

const Hookah: FC<HookahProps> = ({ data }) => {
  return (
    <WrapperProduct data={data}>
      <ProductOverviewWithGallerySection
        data={data}
        query={GET_HOOKAHS_BY_PRODUCT_OD_ID_QUERY}
      />
    </WrapperProduct>
  );
};

export { Hookah };
