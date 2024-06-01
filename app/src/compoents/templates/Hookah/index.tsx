"use client";

import {
  ProductOverviewWithGallerySection,
  ProductDetailsSection
} from "@/compoents/organisms";
import { FC } from "react";

interface HookahProps {
  data: any;
  loading?: boolean;
}

const Hookah: FC<HookahProps> = ({ data }) => {
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

export { Hookah };
