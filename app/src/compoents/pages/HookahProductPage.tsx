"use client";

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
    <div className="w-full h-full">
      <Hookah data={data} />
    </div>
  );
};

export { HookahProductPage };
