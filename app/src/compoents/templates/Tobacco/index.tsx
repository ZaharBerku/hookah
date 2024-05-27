"use client";

import { ProductOverviewWithGallerySection, ProductDetailsSection } from "@/compoents/organisms";

const Tobacco = () => {
  return (
    <div className="relative flex flex-col gap-16">
      <ProductOverviewWithGallerySection />
      <ProductDetailsSection details={""} name={"Табак"} />
    </div>
  );
};

export { Tobacco };
