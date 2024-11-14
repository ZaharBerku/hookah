"use client";

import { Typography } from "@/compoents/atoms";
import {
  Cards,
  ProductSection,
  WrapperProductWithFilter,
  WrapperWithBreadcrumb
} from "@/compoents/organisms";
import { GET_PRODUCTS_QUERY } from "@/query/schema";
import { useLazyQuery } from "@apollo/client";
import { useLocale } from "next-intl";
import { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";

import { useGetAllSearchParams } from "@/hooks";
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
