"use client";

import { WrapperWithBreadcrumb } from "@/compoents/organisms";
import { Accessory } from "@/compoents/templates";
import { FC } from "react";

interface AccessoryProductPagePorps {
  data: any;
  loading: boolean;
}

const AccessoryProductPage: FC<AccessoryProductPagePorps> = ({
  data,
  loading
}) => {
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
        <Accessory data={data} />
      </div>
    </WrapperWithBreadcrumb>
  );
};

export { AccessoryProductPage };
