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
  
  const defaultText: { [key: string]: string } = {
    [data?.attributes?.compositeId]: data?.attributes?.name,
    [data?.attributes?.brand?.data.attributes.slug]:
      data?.attributes?.brand?.data.attributes.name
  };
  return (
    <WrapperWithBreadcrumb
      getDefaultTextGenerator={(subpath) =>
        defaultText[subpath] ? defaultText[subpath] : subpath
      }
    >
      <div className="w-full h-full">
        <Tobacco data={data} />
      </div>
    </WrapperWithBreadcrumb>
  );
};

export { TobaccoProductPage };
