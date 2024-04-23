"use client";

import { List } from "@/compoents/atoms";
import { CartCardSkeleton } from "@/compoents/organisms";

const ListCartCardSkeleton = () => {
  return (
    <div className="px-6 border-black border border-opacity-10 rounded-3xl">
      <List>
        <List.Item className="border-b border-black border-opacity-10 last:border-none">
          <CartCardSkeleton />
        </List.Item>
        <List.Item className="border-b border-black border-opacity-10 last:border-none">
          <CartCardSkeleton />
        </List.Item>
        <List.Item className="border-b border-black border-opacity-10 last:border-none">
          <CartCardSkeleton />
        </List.Item>
      </List>
    </div>
  );
};

export { ListCartCardSkeleton };
