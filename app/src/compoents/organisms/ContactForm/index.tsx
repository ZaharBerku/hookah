"use client";

import { Field, FieldFormat, Typography } from "@/compoents/atoms";
import { Autocomplete } from "@/compoents/molecules";
import axios from "axios";
import { FormikValues } from "formik";
import { useLocale } from "next-intl";
import { ChangeEvent, FC, Key, useState } from "react";

import { useAsyncList } from "@/hooks/index";
import { OptionsType } from "@/utils/types";

interface ContactFormProps {
  formik: FormikValues;
}

const ContactForm: FC<ContactFormProps> = ({ formik }) => {
  const currentLocation = useLocale();
  const [selectCityRef, setSlectCityRef] = useState<Key | null>("");

  const fetchNovaPoshta = async (query: any) => {
    const { data } = await axios.get("/api/novaposhta", {
      params: query
    });

    return data;
  };

  const listWarehouses = useAsyncList<any>({
    initialQuery: {
      location: currentLocation,
      method: "getWarehouses"
    },
    asyncFunction: async (query) => {
      const { data } = await fetchNovaPoshta(query);
      const options = data.map((item: any) => {
        return { label: item.Description, value: item.Ref };
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
      const options = data.at(0).Addresses.map((item: any) => {
        return { label: item.Present, value: item.Ref };
      });
      return options;
    }
  });

  const handleChangeCity = async (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    list.fetch({
      cityName: value,
      location: currentLocation
    });
    formik.setFieldValue("city", value);
  };

  const handleChangeWarehouses = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    listWarehouses.fetch({
      settlementRef: selectCityRef,
      findByString: value,
      location: currentLocation
    });
    formik.setFieldValue("warehouses", value);
  };

  return (
    <div className="flex flex-col justify-start w-full flex-[60%] gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Field
          helperText={formik?.touched?.name && formik?.errors?.name}
          onChange={formik.handleChange}
          name={"name"}
          placeholder="Степан"
          label={"Ім'я"}
          full
          isRequred
        />
        <Field
          helperText={formik?.touched?.lastName && formik?.errors?.lastName}
          onChange={formik.handleChange}
          name={"lastName"}
          placeholder="Бандера"
          label={"Призвіще"}
          full
          isRequred
        />
        <FieldFormat
          helperText={formik?.touched?.phone && formik?.errors?.phone}
          allowEmptyFormatting
          onChange={formik.handleChange}
          value={formik.values.phone}
          name={"phone"}
          placeholder="+380 67 220 22 22"
          format="+380 ## ### ## ##"
          mask="_"
          label={"Телефон"}
          full
          isRequred
        />
      </div>

      <Typography
        className="!text-lg text-black font-bold"
        tag="h2"
        text="Інформація про доставку"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Autocomplete
          helperText={formik?.touched?.city && formik?.errors?.city}
          placeholder="м. Київ, Київська обл."
          label={"Населений пункт"}
          isLoading={list.isLoading}
          full
          options={list.data}
          isRequred
          onChange={handleChangeCity}
          handleOptionClick={(option: OptionsType) => {
            formik.setFieldValue("city", option.label);
            setSlectCityRef(option.value);
          }}
        />
        <Autocomplete
          helperText={formik?.touched?.warehouses && formik?.errors?.warehouses}
          placeholder="Поштомат 'Нова Пошта' №35035"
          label={"Адреса НП"}
          isLoading={listWarehouses.isLoading}
          full
          options={listWarehouses.data}
          isRequred
          onChange={handleChangeWarehouses}
          handleOptionClick={(option: OptionsType) => {
            formik.setFieldValue("warehouses", option.label);
            setSlectCityRef(option.value);
          }}
        />
      </div>
    </div>
  );
};

export { ContactForm };
