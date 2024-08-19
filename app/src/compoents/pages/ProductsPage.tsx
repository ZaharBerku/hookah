"use client";

import { Icon, Typography } from "@/compoents/atoms";
import { DynamicLinkListList } from "@/compoents/molecules";
import {
  ProductSection,
  WrapperWithBreadcrumb,
  WrapperProductWithFilter
} from "@/compoents/organisms";
import { GET_PRODUCTS_QUERY } from "@/query/schema";
import { useLazyQuery } from "@apollo/client";
import { useLocale } from "next-intl";
import { FC, useState, Suspense, useEffect } from "react";
import toast from "react-hot-toast";

import { useGetAllSearchParams } from "@/hooks";
import { getLocale } from "@/utils/helpers";
import { CategoryType } from "@/utils/types";

interface ProductsPageProps {
  label: string;
  category?: CategoryType;
  defaultFilter?: any;
  quary?: any;
  loading?: boolean;
  list?: any;
  type?: string;
}

const ProductsPage: FC<ProductsPageProps> = ({
  label,
  loading,
  list,
  category,
  type,
  quary = GET_PRODUCTS_QUERY,
  defaultFilter
}) => {
  const initialVariables = useGetAllSearchParams();
  const [products, setProducts] = useState<any>(null);
  const locale = useLocale();
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  const [fetchProducts, { data: currentData, previousData }] =
    useLazyQuery(quary);

  const fetchPaginationProduct = async () => {
    const currentLocale = getLocale({ locale } as { locale: "uk" | "ru" });
    const data = await fetchProducts({
      variables: {
        locale: currentLocale,
        filters: {
          ...defaultFilter,
          ...initialVariables,
          category: { name: { eq: category } },
          type: { slugType: { eq: type } }
        },
        page: currentData?.products?.meta?.pagination?.page + 1
      }
    });
    setProducts((currentProducts: any) => [
      ...currentProducts,
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
            ...defaultFilter,
            ...values,
            category: { name: { eq: category } },
            type: { slugType: { eq: type } }
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
    <WrapperWithBreadcrumb>
      <section className="relative flex flex-col gap-4 w-full">
        <Typography
          className="text-xl text-black font-bold"
          tag="h2"
          text={label}
        />
        {list && category && (
          <DynamicLinkListList list={list} type={type} category={category} />
        )}

        <WrapperProductWithFilter
          fetchFilterProduct={fetchFilterProduct}
          category={category}
        >
          {isLoadingProducts || !products ? (
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

const SuspendedProductsPage: FC<ProductsPageProps> = (props) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsPage {...props} />
    </Suspense>
  );
};

export { SuspendedProductsPage as ProductsPage };
