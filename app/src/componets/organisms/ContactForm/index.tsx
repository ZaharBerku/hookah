"use client";

import { Field, FieldFormat, Typography } from "@/componets/atoms";
import { Autocomplete } from "@/componets/molecules";
import axios from "axios";
import type { FormikValues } from "formik";
import { useLocale, useTranslations } from "next-intl";
import { type ChangeEvent, type FC, type Key, useState } from "react";

import { useAsyncList } from "@/hooks/index";
import type { OptionsType } from "@/utils/types";

interface ContactFormProps {
  formik: FormikValues;
}

const ContactForm: FC<ContactFormProps> = ({ formik }) => {
  const currentLocation = useLocale();
  const t = useTranslations("ContactForm");
  // const localeUser = useGetLocaleUser()
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

  const handleOpenCity = () => {
    if (!formik.values.city) {
      list.fetch({
        cityName: "",
        location: currentLocation
      });
    }
  };

  const handleOpenWarehouse = () => {
    if (selectCityRef && !formik.values.warehouses) {
      listWarehouses.fetch({
        settlementRef: selectCityRef,
        findByString: "",
        location: currentLocation
      });
    }
  };

  return (
    <div className="flex flex-col justify-start w-full flex-[60%] gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Field
          helperText={formik?.touched?.name && formik?.errors?.name}
          onChange={formik.handleChange}
          name={"name"}
          placeholder={t("placeholders.name")}
          label={t("labels.name")}
          full
          isRequred
        />
        <Field
          helperText={formik?.touched?.lastName && formik?.errors?.lastName}
          onChange={formik.handleChange}
          name={"lastName"}
          placeholder={t("placeholders.lastName")}
          label={t("labels.lastName")}
          full
          isRequred
        />
        <FieldFormat
          helperText={formik?.touched?.phone && formik?.errors?.phone}
          allowEmptyFormatting
          onChange={formik.handleChange}
          value={formik.values.phone}
          name={"phone"}
          placeholder={t("placeholders.phone")}
          format={"+380 ## ### ## ##"}
          mask={"_"}
          label={t("labels.phone")}
          full
          isRequred
        />
      </div>

      <Typography
        className="!text-lg text-black font-bold"
        tag="h2"
        text={t("sections.deliveryInfo")}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Autocomplete
          helperText={formik?.touched?.city && formik?.errors?.city}
          placeholder={t("placeholders.city")}
          label={t("labels.city")}
          isLoading={list.isLoading}
          full
          options={list.data}
          isRequred
          onChange={handleChangeCity}
          setOpen={(open) => {
            if (open) {
              handleOpenCity();
            }
          }}
          handleOptionClick={(option: OptionsType) => {
            formik.setFieldValue("city", option.label);
            setSlectCityRef(option.value);
          }}
        />
        <Autocomplete
          helperText={formik?.touched?.warehouses && formik?.errors?.warehouses}
          placeholder={t("placeholders.warehouses")}
          label={t("labels.warehouses")}
          isLoading={listWarehouses.isLoading}
          full
          options={listWarehouses.data}
          isRequred
          setOpen={(open) => {
            if (open) {
              handleOpenWarehouse();
            }
          }}
          onChange={handleChangeWarehouses}
          handleOptionClick={(option: OptionsType) => {
            formik.setFieldValue("warehouses", option.label);
          }}
        />
      </div>
    </div>
  );
};

export { ContactForm };
