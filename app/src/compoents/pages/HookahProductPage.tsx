"use client";

import { WrapperWithBreadcrumb } from "@/compoents/organisms";
import { Hookah } from "@/compoents/templates";
import { FC } from "react";

interface HookahProductPageProps {
  data: any;
  loading: boolean;
}

const HookahProductPage: FC<HookahProductPageProps> = ({ data, loading }) => {
  if (loading) {
    return null;
  }
  return (
    <WrapperWithBreadcrumb>
      <div className="w-full h-full">
        <Hookah data={data} />
      </div>
    </WrapperWithBreadcrumb>
  );
};

export { HookahProductPage };
