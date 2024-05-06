import {
  ListCartCardSkeleton,
  OrderAmountSkeleton
} from "@/compoents/organisms";
import dynamic from "next/dynamic";

import { Typography } from "../atoms";

const ListCartCard = dynamic(() => import("../organisms/ListCartCard"), {
  ssr: false,
  loading: () => <ListCartCardSkeleton />
});

const OrderAmount = dynamic(() => import("../organisms/OrderAmount"), {
  ssr: false,
  loading: () => <OrderAmountSkeleton />
});

const CartPage = () => {
  return (
    <section className="relative flex flex-col gap-4 w-full">
      <Typography
        className="text-xl text-black font-bold"
        tag="h1"
        text="Корзина"
      />
      <div className="flex gap-5 flex-col lg:flex-row">
        <ListCartCard />
        <OrderAmount />
      </div>
    </section>
  );
};

export { CartPage };
