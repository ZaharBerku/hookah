"use client";

import { Button } from "@/compoents/atoms";
import { Autocomplete } from "@/compoents/molecules";
import { SEARCH_PRODUCTS_QUERY } from "@/query/schema";
import { useLazyQuery } from "@apollo/client";
import { useLocale, useTranslations } from "next-intl";
import { ChangeEvent, FormEvent, useState } from "react";

import { useAsyncList } from "@/hooks";
import { locales, useRouter } from "@/utils/navigation";
import { OptionsType } from "@/utils/types";

const MainSearch = () => {
  const t = useTranslations("Home.Header.Search");
  const router = useRouter();
  const locale = useLocale();
  const [value, setValue] = useState("");
  const [data, setData] = useState([]);
  const [searchProducts, { loading }] = useLazyQuery(SEARCH_PRODUCTS_QUERY, {
    onCompleted: (result) => {
      const data = result?.products?.data?.map((item: any) => ({
        image: item.attributes.previewImage.data.attributes.url,
        alt:
          item.attributes.previewImage.data.attributes.alternativeText ||
          "product",
        label: item.attributes.name,
        value: item.attributes?.type?.data?.attributes?.slugType
          ? `/${item.attributes.category.data.attributes.name}/${item.attributes?.type?.data?.attributes?.slugType}/${item.attributes.brand.data.attributes.slug}/${item.attributes.compositeId}`
          : `/${item.attributes.category.data.attributes.name}/${item.attributes.brand.data.attributes.slug}/${item.attributes.compositeId}`
      }));

      setData(data || []);
    }
  });

  const listProducts = useAsyncList<any>({
    asyncFunction: async (query) => {
      await searchProducts(query);
    }
  });

  const handleOptionClick = (option: OptionsType) => {
    router.push(option.value);
    setValue("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (value) {
      const query = new URLSearchParams({ seach: value }).toString();
      router.push(`/search?${query}`);
      setValue("");
    }
  };

  const handleChangeSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const currentLocale = locales.includes(locale as "uk" | "ru")
      ? locale
      : "uk";
    listProducts.fetch({
      variables: { locale: currentLocale, name: event.target.value, limit: 10 }
    });
  };

  return (
    <form className="w-full" noValidate={false} onSubmit={handleSubmit}>
      <Autocomplete
        autoComplete="off"
        name={"search"}
        className="text-base leading-5 w-full rounded-md !outline-none"
        classes={{
          containerInput:
            "gap-3 pr-0 border-light-dark-secondary md:border-black !rounded-md",
          list: "h-[calc(100dvh-81px)] md:h-auto !max-h-max md:!max-h-60 !fixed md:!absolute !inset-0 md:!inset-auto md:!left-0 !top-[81px] md:!top-full !mt-0 md:!my-1 !border-0 md:!border"
        }}
        placeholder={t("placeholder")}
        sideElements={{
          right: (
            <Button
              color="accent"
              type="submit"
              rounded="none"
              className="!h-12 md:!h-full -mr-px md:mr-0 px-3 !text-base md:px-6 !rounded-r-md"
            >
              {t("button")}
            </Button>
          )
        }}
        setCurrentValue={setValue}
        currentValue={value}
        isLoading={loading}
        full
        options={data}
        isRequred
        onChange={handleChangeSearch}
        handleOptionClick={handleOptionClick}
      />
    </form>
  );
};

export { MainSearch };
