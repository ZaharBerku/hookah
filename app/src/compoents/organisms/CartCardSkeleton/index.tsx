"use client";

import { Skeleton } from "@nextui-org/skeleton";
import { FC } from "react";

const CartCardSkeleton: FC = () => {
  return (
    <article className="w-full py-6 flex gap-4">
      <div className="relative rounded-lg max-w-32 h-32 w-full shadow-3xl shadow-card-shadow-color">
        <Skeleton className="absoute inset-0 h-full rounded-lg" />
      </div>
      <div className="flex flex-col w-full justify-between">
        <div className="flex items-center justify-between">
          <Skeleton className="rounded-lg h-8 max-w-32 w-full" />

          <Skeleton className={"rounded-lg w-6 h-6"} />
        </div>
        <div className="w-full flex items-center justify-between">
          <div className="flex gap-4">
            <Skeleton className={"rounded-lg w-10 h-6"} />
          </div>
          <Skeleton className={"rounded-9xl w-full h-8 max-w-20"} />
        </div>
      </div>
    </article>
  );
};

export { CartCardSkeleton };
