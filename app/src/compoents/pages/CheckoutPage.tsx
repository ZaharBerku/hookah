"use client";

import { Typography } from "@/compoents/atoms";
import {
  ContactForm,
  OrderAmountSkeleton,
  WrapperWithBreadcrumb
} from "@/compoents/organisms";
import { CREATE_ORDER_MUTATION } from "@/query/order";
import { useMutation } from "@apollo/client";
import axios from "axios";
import { useFormik } from "formik";
import { observer } from "mobx-react-lite";
import dynamic from "next/dynamic";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

import { useStores } from "@/hooks";
import { modalNames } from "@/utils/variables";

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
  const { cart, modal } = useStores();
  const [createOrder] = useMutation(CREATE_ORDER_MUTATION);
  const handleSubmit = async (values: ContactFormValues) => {
    modal.showSpinner();
    try {
      const order = cart.cart.map((product: any) => ({
        id: product.id,
        odId: product.odId,
        name: product.name,
        price: product.price,
        discount: product.discount,
        quantity: product.quantity,
        numberOf: product.numberOf
      }));
      const data = {
        name: values.name,
        phoneNumber: values.phone,
        address: values.city,
        department: values.warehouses,
        order,
        publishedAt: new Date().toISOString()
      };
      await createOrder({
        variables: {
          data
        }
      });
    } catch (e) {
      console.error(e);
    }

    try {
      await axios.post("/api/sendOrder", {
        ...values,
        products: cart.cart
      });

      cart.clearCart();
      modal.openModal(modalNames.ModalCompletionOrder);
    } catch (error) {
      console.log(error);
      toast.error("Щось пішло не так! Спробуйте ще раз)");
    } finally {
      modal.hideSpinner();
    }
  };

  const formik = useFormik({
    initialValues,
    onSubmit: handleSubmit,
    validationSchema: toFormikValidationSchema(Schema)
  });

  return (
    <WrapperWithBreadcrumb>
      <section className="flex flex-col gap-6 w-full">
        <Typography tag="h1" text="Контактна інформація" />
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
    </WrapperWithBreadcrumb>
  );
});

export { CheckoutPage };
