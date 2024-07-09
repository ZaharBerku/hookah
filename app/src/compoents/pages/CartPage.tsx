"use client";

import { Icon, Typography } from "@/compoents/atoms";
import {
  ListCartCardSkeleton,
  OrderAmountSkeleton,
  WrapperWithBreadcrumb
} from "@/compoents/organisms";
import { GET_PRODUCTS_BY_COMPOSITE_ID_QUERY } from "@/query/schema";
import { useQuery } from "@apollo/client";
import { observer } from "mobx-react-lite";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
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
  const { loading, error, data, refetch } = useQuery(
    GET_PRODUCTS_BY_COMPOSITE_ID_QUERY,
    {
      variables: {
        compositeIds: Object.keys(cart.selectedProducts)
      }
    }
  );

  data?.products?.data;
  const router = useRouter();
  const t = useTranslations("Button.Buy");
  const handleCheckout = () => {
    router.push("/cart/checkout");
  };

  useEffect(() => {
    if (data?.products?.data) {
      cart.setProductsToCart(data?.products?.data);
    }
  }, [data]);

  useEffect(() => {
    refetch({
      compositeIds: Object.keys(cart.selectedProducts)
    });
  }, [Object.keys(cart.selectedProducts).length]);

  if (error) notFound();
  return (
    <WrapperWithBreadcrumb>
      <section className="relative flex flex-col gap-4 w-full">
        <Typography tag="h1" text="Корзина" />
        {loading ? (
          <div className="flex justify-center items-center py-36">
            <Icon type="SpinnerIcon" className="w-24 h-24" />
          </div>
        ) : (
          <div className="flex gap-5 flex-col lg:flex-row">
            <ListCartCard />
            <OrderAmount
              textButton={t("text")}
              handleCheckout={handleCheckout}
              title="Сума замовлення"
            />
          </div>
        )}
      </section>
    </WrapperWithBreadcrumb>
  );
});

export { CartPage };
