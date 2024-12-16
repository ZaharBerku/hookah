"use client";

import { Icon, Typography } from "@/compoents/atoms";
import {
  ListCartCardSkeleton,
  OrderAmountSkeleton,
  WrapperWithBreadcrumb
} from "@/compoents/organisms";
import { observer } from "mobx-react-lite";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { useEffect } from "react";

import { useStores } from "@/hooks";
import { useRouter } from "@/utils/navigation";

const ListCartCard = dynamic(() => import("../organisms/ListCartCard"), {
  ssr: false,
  loading: () => <ListCartCardSkeleton />
});

const OrderAmount = dynamic(() => import("../organisms/OrderAmount"), {
  ssr: false,
  loading: () => <OrderAmountSkeleton />
});

const CartPage = observer(() => {
  const { cart } = useStores();
  const { loading, refetchProductsInTheCart } = cart;

  const router = useRouter();
  const t = useTranslations();
  const handleCheckout = () => {
    router.push("/cart/checkout");
  };

  useEffect(() => {
    refetchProductsInTheCart();
  }, []);

  return (
    <WrapperWithBreadcrumb>
      <section className="relative flex flex-col gap-4 w-full">
        <Typography tag="h1" text="Корзина" />
        {loading ? (
          <div className="flex justify-center items-center py-36">
            <Icon type="SpinnerIcon" className="w-24 h-24 animate-spin" />
          </div>
        ) : (
          <div className="flex gap-5 flex-col lg:flex-row">
            <ListCartCard />
            <OrderAmount
              textButton={t("Button.Buy.text")}
              handleCheckout={handleCheckout}
              title={t("Cart.sum")}
            />
          </div>
        )}
      </section>
    </WrapperWithBreadcrumb>
  );
});

export { CartPage };
