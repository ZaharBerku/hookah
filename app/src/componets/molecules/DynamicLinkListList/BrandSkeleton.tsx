"use client";

import { Skeleton } from "@nextui-org/skeleton";
import clsx from "clsx";
import { FC } from "react";

const BrandSkeleton: FC = () => {
  return (
    <div
      className={clsx(
        "flex justify-start border-r-2 border-r-light-dark-accent w-auto items-center text-sm md:text-base font-normal text-black cursor-pointer gap-2 px-2 md:px-5 py-2 border border-white border-opacity-20"
      )}
    >
      <Skeleton className="h-8 min-w-8 md:h-15 md:min-w-15" />
      <Skeleton className="w-20 h-4 md:w-32" />
    </div>
  );
};
export { BrandSkeleton };
