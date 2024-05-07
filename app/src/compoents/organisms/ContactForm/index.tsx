"use client";

import { Field, FieldFormat } from "@/compoents/atoms";
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
      <Field placeholder="Степан" label={"Ім'я"} full isRequred />
      <Field placeholder="Бандера" label={"Призвіще"} full isRequred />
      <Field placeholder="Київ" label={"Місто"} full isRequred />
      <FieldFormat
        placeholder="+380 67 220 22 22"
        format="+380 ## ### ## ##"
        label={"Телефон"}
        prefix="+"
        full
        isRequred
      />
    </form>
  );
};

export { ContactForm };
