"use client";

import { Skeleton } from "@nextui-org/skeleton";
import { FC } from "react";

const OrderAmountSkeleton: FC = () => {
  return (
    <div className="px-6 py-5 border-black border border-opacity-10 flex flex-col gap-6 justify-between rounded-3xl flex-[40%] max-h-96">
      <Skeleton className="h-7 w-15 rounded-lg" />
      <ul className="flex flex-col w-full gap-5 border-b border-black border-opacity-10 pb-5">
        <li className="flex justify-between items-center">
          <Skeleton className="h-5 w-10 rounded-lg" />
          <Skeleton className="h-5 w-7 rounded-lg" />
        </li>
        <li className="flex justify-between items-center">
          <Skeleton className="h-5 w-10 rounded-lg" />
          <Skeleton className="h-5 w-7 rounded-lg" />
        </li>
        <li className="flex justify-between items-center">
          <Skeleton className="h-5 w-10 rounded-lg" />
          <Skeleton className="h-5 w-7 rounded-lg" />
        </li>
      </ul>
      <div className="flex justify-between items-center">
        <Skeleton className="h-5 w-10 rounded-lg" />
        <Skeleton className="h-5 w-7 rounded-lg" />
      </div>
      <Skeleton className="h-10 md:h-12 rounded-full" />
    </div>
  );
};

export { OrderAmountSkeleton };
