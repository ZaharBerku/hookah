"use client";

import { Field, FieldFormat } from "@/compoents/atoms";
import { Autocomplete } from "@/compoents/molecules";
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

export const animals = [
  {
    label: "Cat",
    value: "cat",
    description: "The second most popular pet in the world"
  },
  {
    label: "Dog",
    value: "dog",
    description: "The most popular pet in the world"
  },
  {
    label: "Elephant",
    value: "elephant",
    description: "The largest land animal"
  },
  { label: "Lion", value: "lion", description: "The king of the jungle" },
  { label: "Tiger", value: "tiger", description: "The largest cat species" },
  {
    label: "Giraffe",
    value: "giraffe",
    description: "The tallest land animal"
  },
  {
    label: "Dolphin",
    value: "dolphin",
    description: "A widely distributed and diverse group of aquatic mammals"
  },
  {
    label: "Penguin",
    value: "penguin",
    description: "A group of aquatic flightless birds"
  },
  {
    label: "Zebra",
    value: "zebra",
    description: "A several species of African equids"
  },
  {
    label: "Shark",
    value: "shark",
    description:
      "A group of elasmobranch fish characterized by a cartilaginous skeleton"
  },
  {
    label: "Whale",
    value: "whale",
    description: "Diverse group of fully aquatic placental marine mammals"
  },
  {
    label: "Otter",
    value: "otter",
    description: "A carnivorous mammal in the subfamily Lutrinae"
  },
  {
    label: "Crocodile",
    value: "crocodile",
    description: "A large semiaquatic reptile"
  }
];

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
      <Autocomplete
        options={animals}
        placeholder="Київ"
        label={"Місто"}
        full
        isRequred
      />
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
