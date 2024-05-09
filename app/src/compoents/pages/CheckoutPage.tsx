"use client";

import { Typography } from "@/compoents/atoms";
import { ContactForm, OrderAmountSkeleton } from "@/compoents/organisms";
import { useFormik } from "formik";
import dynamic from "next/dynamic";

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
  phone: null,
  warehouses: "",
};

const CheckoutPage = () => {
  const handleSubmit = (values: ContactFormValues) => {
    console.log(values, "values");
  };
  const formik = useFormik({
    initialValues,
    onSubmit: handleSubmit
  });
  return (
    <section className="flex flex-col gap-6 w-full">
      <Typography
        className="text-xl text-black font-bold"
        tag="h1"
        text="Контактна інформація"
      />
      <form
        onSubmit={formik.handleSubmit}
        className="flex gap-6 items-start flex-col lg:flex-row"
      >
        <ContactForm formik={formik} />
        <OrderAmount
          handleCheckout={formik.submitForm}
          title="Ваше замовлення"
          textButton={"Замовити"}
        />
      </form>
    </section>
  );
};

export { CheckoutPage };
