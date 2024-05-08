"use client";

import { Field, FieldFormat, Select } from "@/compoents/atoms";
import { Autocomplete } from "@/compoents/molecules";
import axios from "axios";
import { useFormik } from "formik";
import { useLocale } from "next-intl";
import { useState } from "react";

import { useAsyncList } from "@/hooks/index";

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
  const [value, setValue] = useState("");
  const currentLocation = useLocale();

  const handleSubmit = (values: ContactFormValues) => {
    console.log(values, "values");
  };

  const formik = useFormik({
    initialValues,
    onSubmit: handleSubmit
  });

  const fetchNovaPoshta = async (query: any) => {
    const { data } = await axios.get("/api/novaposhta", {
      params: query
    });
    return data;
  };

  const listWarehouses = useAsyncList<any>({
    initialQuery: {
      location: currentLocation,
      cityName: formik.values.city,
      method: "getWarehouses"
    },
    asyncFunction: async (query) => {
      const { data } = await fetchNovaPoshta(query);
      const options = data.data.at(0).Addresses.map((item: any) => {
        return { label: item.Present, value: item.Ref };
      });
      return options;
    }
  });

  const list = useAsyncList<any>({
    initialQuery: {
      location: currentLocation,
      cityName: formik.values.city
    },
    asyncFunction: async (query) => {
      const { data } = await fetchNovaPoshta(query);
      const options = data.data.at(0).Addresses.map((item: any) => {
        return { label: item.Present, value: item.Ref };
      });
      return options;
    }
  });

  const handleChangeCity = async (value: string) => {
    list.fetch({
      cityName: value,
      location: currentLocation
    });
    formik.setFieldValue("city", value);
  };

  const handleChangeWarehouses = async (value: string) => {
    list.fetch({
      cityName: formik.values.city,
      findByString: value,
      location: currentLocation
    });
    formik.setFieldValue("city", value);
  };

  return (
    <form
      className="grid grid-cols-1 lg:grid-cols-2 gap-4"
      onSubmit={formik.handleSubmit}
    >
      <Field
        onChange={formik.handleChange}
        name={"name"}
        placeholder="Степан"
        label={"Ім'я"}
        full
        isRequred
      />
      <Field
        onChange={formik.handleChange}
        name={"lastName"}
        placeholder="Бандера"
        label={"Призвіще"}
        full
        isRequred
      />
      <FieldFormat
        onChange={formik.handleChange}
        name={"phone"}
        placeholder="+380 67 220 22 22"
        format="+380 ## ### ## ##"
        label={"Телефон"}
        prefix="+"
        full
        isRequred
      />
      <Select
        full
        label={"Спосіб доставки"}
        placeholder={"НП"}
        options={[
          {
            value: "",
            label: "Відділення НП"
          },
          {
            value: "test2",
            label: "Поштомат"
          }
        ]}
      />

      <Autocomplete
        placeholder="Київ"
        label={"Місто"}
        full
        inputValue={value}
        isLoading={list.isLoading}
        items={list.data}
        onSelectionChange={(event) => console.log(event, "event")}
        onInputChange={handleChangeCity}
        isRequred
      />
      <Autocomplete
        placeholder="Київ"
        label={"Нова"}
        full
        inputValue={value}
        isLoading={listWarehouses.isLoading}
        items={listWarehouses.data}
        onSelectionChange={(event) => console.log(event, "event")}
        onInputChange={handleChangeWarehouses}
        isRequred
      />
    </form>
  );
};

export { ContactForm };
