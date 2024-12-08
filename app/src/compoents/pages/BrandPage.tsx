"use client";

import { Typography } from "@/compoents/atoms";
import { BrandSkeleton } from "@/compoents/molecules/DynamicLinkListList/BrandSkeleton";
import {
  Cards,
  ProductSection,
  WrapperProductWithFilter,
  WrapperWithBreadcrumb
} from "@/compoents/organisms";
import { GET_PRODUCTS_QUERY } from "@/query/schema";
import { useLazyQuery } from "@apollo/client";
import clsx from "clsx";
import { Formik, FormikValues, useFormikContext } from "formik";
import { useLocale } from "next-intl";
import Image from "next/image";
import { FC, useEffect, useState, ComponentProps } from "react";
import toast from "react-hot-toast";

import { useGetAllSearchParams, useURLParams } from "@/hooks";
import { getLocale } from "@/utils/helpers";
import { CategoryType } from "@/utils/types";

interface BrandPageProps {
  label: string;
  slugBrand: string;
  loading: boolean;
  category: CategoryType;
  defaultPageFitler?: string;
  type?: string;
}

interface BrandProps extends ComponentProps<"button"> {
  label: string;
}

interface DynamicLinkListListProps {
  list: any;
}

const Brand: FC<BrandProps> = ({ label, value }) => {
  const NAME = "currentProduct.tobacco.strength.in";
  const { updateURLParams } = useURLParams();
  const initialValues = useGetAllSearchParams();

  const { getFieldProps, setFieldValue, setValues } = useFormikContext();
  const field = getFieldProps(NAME);
  const handleClick = () => {
    const set = new Set(field.value || []);
    if (set.has(value)) {
      set.delete(value);
    } else {
      set.add(value);
    }
    const result = Array.from(set);
    updateURLParams(NAME, result.length ? result : undefined);
    setFieldValue(NAME, result.length ? result : undefined);
  };

  useEffect(() => {
    setValues(initialValues);
  }, [JSON.stringify(initialValues)]);

  return (
    <button
      onClick={handleClick}
      className={clsx(
        "flex justify-start flex-1 border-r-2 border-r-light-dark-accent w-auto lg:active:bg-gray-200 lg:hover:bg-gray-200 items-center text-sm md:text-base font-normal text-black cursor-pointer gap-2 px-2 md:px-5 py-2 border border-white border-opacity-20",
        {
          ["bg-gray-200"]: field.value?.includes(value)
        }
      )}
    >
      <span className="h-8 min-w-8 md:h-15 md:min-w-15 relative">
        <Image
          fill
          loading="lazy"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain"
          src={
            "https://strapi-hookah-images.s3.us-east-1.amazonaws.com/420_240x240_91bf3a05de.webp"
          }
          alt="avatar-branda"
        />
      </span>
      {label}
    </button>
  );
};

const DynamicLinkListList: FC<DynamicLinkListListProps> = ({ list }) => {
  const initialValues = useGetAllSearchParams();
  const handleSubmit = async (values: FormikValues) => {};
  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      <div className="p-2">
        <div className="bg-white shadow-3xl shadow-card-shadow-color rounded-3xl overflow-hidden -mr-1">
          <menu className="flex">
            {list
              ? list.map((item: any) => {
                  return (
                    <Brand
                      value={item.value}
                      label={item.label}
                      key={item.value}
                    />
                  );
                })
              : Array.from({ length: 5 }).map((_, index) => (
                  <BrandSkeleton key={index} />
                ))}
          </menu>
        </div>
      </div>
    </Formik>
  );
};

const list = [
  {
    label: "Light",
    value: "light"
  },
  {
    label: "Classic",
    value: "medium"
  }
];

const BrandPage: FC<BrandPageProps> = ({
  label,
  slugBrand,
  loading,
  category,
  type,
  defaultPageFitler
}) => {
  const initialVariables = useGetAllSearchParams();
  const [products, setProducts] = useState<any>(null);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [fetchProducts, { data: currentData, previousData }] =
    useLazyQuery(GET_PRODUCTS_QUERY);
  const locale = useLocale();

  const fetchPaginationProduct = async (values?: any) => {
    const currentLocale = getLocale({ locale } as { locale: "uk" | "ru" });
    const data = await fetchProducts({
      variables: {
        locale: currentLocale,
        filters: {
          ...values,
          brand: {
            slug: { eq: slugBrand }
          },
          category: { name: { eq: category } }
        },
        page: currentData?.products?.meta?.pagination?.page + 1
      }
    });
    setProducts((currentProducts: any) => [
      ...(currentProducts || []),
      ...data.data.products.data
    ]);
  };

  const fetchFilterProduct = async (values?: any) => {
    setIsLoadingProducts(true);
    const currentLocale = getLocale({ locale } as { locale: "uk" | "ru" });
    try {
      const data = await fetchProducts({
        variables: {
          locale: currentLocale,
          filters: {
            category: { name: { eq: category } },
            type: { slugType: { eq: type } },
            brand: {
              slug: { eq: slugBrand }
            },
            ...values
          }
        }
      });
      setProducts(data.data.products.data);
    } catch (error) {
      toast.error("Щось пішло не так! Спробуйте ще раз)");
    } finally {
      setIsLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchFilterProduct(initialVariables);
  }, []);

  if (loading) {
    return null;
  }

  return (
    <WrapperWithBreadcrumb
      getDefaultTextGenerator={(subpath) =>
        subpath === slugBrand ? label : subpath
      }
    >
      <section className="relative flex flex-col gap-4 w-full">
        <Typography
          className="text-xl text-black font-bold"
          tag="h2"
          text={label}
        />
        {slugBrand === "420" && <DynamicLinkListList list={list} />}
        <WrapperProductWithFilter
          fetchFilterProduct={fetchFilterProduct}
          defaultPageFitler={defaultPageFitler}
        >
          {isLoadingProducts || !products ? (
            <Cards />
          ) : (
            <ProductSection
              data={products}
              fetchPaginationProduct={fetchPaginationProduct}
              paginationData={
                currentData?.products?.meta?.pagination ||
                previousData?.products?.meta?.pagination
              }
            />
          )}
        </WrapperProductWithFilter>
      </section>
    </WrapperWithBreadcrumb>
  );
};

export { BrandPage };
