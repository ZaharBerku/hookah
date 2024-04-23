import { ListCartCardSkeleton } from "@/compoents/organisms";
import dynamic from "next/dynamic";

const ListCartCard = dynamic(() => import("../organisms/ListCartCard"), {
  ssr: false,
  loading: () => <ListCartCardSkeleton />
});

const CartPage = () => {
  return (
    <div className="flex flex-col gap-12 relative">
      <ListCartCard />
    </div>
  );
};

export { CartPage };
