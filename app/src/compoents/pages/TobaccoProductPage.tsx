"use client";

import { WrapperWithBreadcrumb } from "@/compoents/organisms";
import { Tobacco } from "@/compoents/templates";
import { FC } from "react";

interface TobaccoProductPagePorps {
  data: any;
  loading: boolean;
}

const TobaccoProductPage: FC<TobaccoProductPagePorps> = ({ data, loading }) => {
  if (loading) {
    return null;
  }

  return (
    <WrapperWithBreadcrumb
      getDefaultTextGenerator={(subpath) =>
        subpath === data?.attributes?.compositeId ? data?.attributes?.name : subpath
      }
    >
      <div className="w-full h-full">
        <Tobacco data={data} />
      </div>
    </WrapperWithBreadcrumb>
  );
};

export { TobaccoProductPage };
