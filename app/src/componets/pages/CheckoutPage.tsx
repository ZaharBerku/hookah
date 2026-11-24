"use client";

import { Typography } from "@/componets/atoms";
import {
  ContactForm,
  OrderAmountSkeleton,
  WrapperWithBreadcrumb
} from "@/componets/organisms";
import { deleteCookie } from "cookies-next";
import { useFormik } from "formik";
import { observer } from "mobx-react-lite";
import { useLocale, useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

import { useStores } from "@/hooks";
import { createIdempotencyKey, getLocale } from "@/utils/helpers";
import { modalNames, cookiesKeys } from "@/utils/variables";

const phoneRegex = /^(\+380)\s\d{2}\s\d{3}\s\d{2}\s\d{2}$/;

const Schema = z.object({
  name: z.string({ required_error: "Поле є обов'язкове" }).trim(),
  lastName: z.string({ required_error: "Поле є обов'язкове" }).trim(),
  city: z.string({ required_error: "Поле є обов'язкове" }),
  phone: z
    .string({ required_error: "Поле є обов'язкове" })
    .min(5, "Поле є обов'язкове")
    .regex(phoneRegex, "Формат номера не вірний"),
  warehouses: z.string({ required_error: "Поле є обов'язкове" })
});

const OrderAmount = dynamic(() => import("../organisms/OrderAmount"), {
  ssr: false,
  loading: () => <OrderAmountSkeleton />
});

interface ContactFormValues {
  name: string;
  lastName: string;
  city: string;
  phone: string | null;
  warehouses: string;
}

const initialValues: ContactFormValues = {
  name: "",
  lastName: "",
  city: "",
  phone: "",
  warehouses: ""
};

const CheckoutPage = observer(() => {
  const t = useTranslations();
  const locale = useLocale();
  const { cart, modal } = useStores();
  const { promocode } = cart;
  const { refetchProductsInTheCart } = cart;
  const notifyUnavailable = (names: string[]) => {
    toast.error(t("CheckOut.unavailable", { names: names.join(", ") }));
  };

  const idempotencyKey = useRef<string | null>(null);
  const isSubmitting = useRef(false);

  const handleSubmit = async (values: ContactFormValues) => {
    if (isSubmitting.current) return;
    isSubmitting.current = true;
    modal.showSpinner();
    try {
      await refetchProductsInTheCart();
      if (cart.hasUnavailableItems) {
        notifyUnavailable(cart.unavailableItems.map(({ name }) => name));
        return;
      }
      idempotencyKey.current ??= createIdempotencyKey();
      const response = await fetch("/api/sendOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          idempotencyKey: idempotencyKey.current,
          locale: getLocale({ locale: locale as "uk" | "ru" }),
          promocode: promocode?.name,
          items: Object.values(cart.selectedProducts).map((product: any) => ({
            compositeId: product.attributes.compositeId,
            quantity: product.quantity
          }))
        })
      });
      if (response.status !== 502) idempotencyKey.current = null;
      if (response.ok) {
        deleteCookie(cookiesKeys.promocode);
        cart.clearCart();
        modal.openModal(modalNames.ModalCompletionOrder);
        return;
      }
      const result = await response.json().catch(() => ({}));
      if (result.error === "OUT_OF_STOCK") {
        const names = (result.items || []).map((item: any) => {
          const name =
            item.name ||
            cart.selectedProducts[item.compositeId]?.attributes.name;
          if (item.missing) cart.removeProductFromCart(item.compositeId);
          return name;
        });
        notifyUnavailable(names.filter(Boolean));
        await refetchProductsInTheCart();
      } else if (result.error === "PROMOCODE_INVALID") {
        cart.setPromocode(null);
        deleteCookie(cookiesKeys.promocode);
        toast.error(t("CheckOut.promocodeInvalid"));
      } else if (result.error === "INVALID_ORDER") {
        toast.error(
          t(
            result.fields?.includes("items")
              ? "CheckOut.invalidCart"
              : "CheckOut.invalidContact"
          )
        );
      } else if (result.error === "RATE_LIMITED") {
        toast.error(t("CheckOut.rateLimited"));
      } else {
        toast.error(t("CheckOut.error"));
      }
    } catch (error) {
      console.log(error);
      toast.error(t("CheckOut.error"));
    } finally {
      isSubmitting.current = false;
      modal.hideSpinner();
    }
  };

  const formik = useFormik({
    initialValues,
    onSubmit: handleSubmit,
    validationSchema: toFormikValidationSchema(Schema)
  });

  useEffect(() => {
    refetchProductsInTheCart();
  }, []);

  return (
    <WrapperWithBreadcrumb>
      <section className="flex flex-col gap-6 w-full">
        <Typography tag="h1" text={t("CheckOut.contact")} />
        <form
          onSubmit={formik.handleSubmit}
          className="flex gap-6 items-start flex-col lg:flex-row"
        >
          <ContactForm formik={formik} />
          <OrderAmount
            handleCheckout={formik.submitForm}
            title={t("CheckOut.your-order")}
            textButton={t("Button.Order.text")}
            isSubmitting={formik.isSubmitting}
          />
        </form>
      </section>
    </WrapperWithBreadcrumb>
  );
});

export { CheckoutPage };
