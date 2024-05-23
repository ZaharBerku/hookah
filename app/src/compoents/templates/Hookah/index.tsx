"use client";

import { ProductOverviewWithGallerySection, ProductDetailsSection } from "@/compoents/organisms";

const Hookah = () => {
  return (
    <div className="relative flex flex-col gap-16">
      <ProductOverviewWithGallerySection />
      <ProductDetailsSection details={""} name={"КАЛЬЯН GRAMM SOLO"} />
    </div>
  );
};

export { Hookah };
