"use client";

import { Icon, Typography } from "@/compoents/atoms";
import {
  ProductSection,
  WrapperProductWithFilter,
  WrapperWithBreadcrumb
} from "@/compoents/organisms";
import { GET_PRODUCTS_QUERY } from "@/query/schema";
import { useLazyQuery } from "@apollo/client";
import { useLocale } from "next-intl";
import { FC, useEffect, useState } from "react";

import { getLocale } from "@/utils/helpers";
import { CategoryType } from "@/utils/types";

interface BrandPageProps {
  label: string;
  slugBrand: string;
  loading: boolean;
  category: CategoryType;
  defaultPageFitler?: string;
}

const BrandPage: FC<BrandPageProps> = ({
  label,
  slugBrand,
  loading,
  category,
  defaultPageFitler
}) => {
  const [products, setProducts] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
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

  const initialFetch = async () => {
    setIsLoading(true);
    await fetchPaginationProduct();
    setIsLoading(false);
  };

  useEffect(() => {
    initialFetch();
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
          fetchFilterProduct={fetchPaginationProduct}
          defaultPageFitler={defaultPageFitler}
        >
          {isLoading || !products ? (
            <div className="flex justify-center items-center py-36 w-full">
              <Icon type="SpinnerIcon" className="w-24 h-24" />
            </div>
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
