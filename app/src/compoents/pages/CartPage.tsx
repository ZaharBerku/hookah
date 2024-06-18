"use client";

import {
  ListCartCardSkeleton,
  OrderAmountSkeleton,
  WrapperWithBreadcrumb
} from "@/compoents/organisms";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";

import { useRouter } from "@/utils/navigation";

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
  const router = useRouter();
  const t = useTranslations("Button.Buy");
  const handleCheckout = () => {
    router.push("/cart/checkout");
  };
  return (
    <WrapperWithBreadcrumb>
      <section className="relative flex flex-col gap-4 w-full">
        <Typography tag="h1" text="Корзина" />
        <div className="flex gap-5 flex-col lg:flex-row">
          <ListCartCard />
          <OrderAmount
            textButton={t("text")}
            handleCheckout={handleCheckout}
            title="Сума замовлення"
          />
        </div>
      </section>
    </WrapperWithBreadcrumb>
  );
};

export { CartPage };
