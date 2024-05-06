"use client"

import { Field } from "@/compoents/atoms";
import { useFormik } from "formik";

interface ContactFormValues {
  name: string;
  lastName: string;
  city: string;
  phone: string;
}

const initialValues: ContactFormValues = {
  name: "",
  lastName: "",
  city: "",
  phone: ""
};

const ContactForm = () => {
  const handleSubmit = (values: ContactFormValues) => {
    console.log(values, "values");
  };

  const formik = useFormik({
    initialValues,
    onSubmit: handleSubmit
  });
  return (
    <form className="grid grid-cols-2 gap-4" onSubmit={formik.handleSubmit}>
      <Field label={"Ім'я"} required />
      <Field label={"Ім'я"} required />
      <Field label={"Ім'я"} required />
      <Field label={"Ім'я"} required />
    </form>
  );
};

export { ContactForm };
