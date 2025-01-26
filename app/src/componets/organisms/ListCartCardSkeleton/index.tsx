"use client";

import { List } from "@/componets/atoms";
import { CartCardSkeleton } from "@/componets/organisms";
import { Skeleton } from "@nextui-org/skeleton";

const ListCartCardSkeleton = () => {
  return (
    <div className="px-6 py-5 border-black border flex flex-col justify-center items-center border-opacity-10 rounded-3xl flex-[60%]">
      <List className="pb-5 w-full">
        <List.Item className="border-b border-black border-opacity-10">
          <CartCardSkeleton />
        </List.Item>
      </List>
      <Skeleton className="h-10 md:h-12 rounded-full max-w-96 w-full" />
    </div>
  );
};

export { ListCartCardSkeleton };
