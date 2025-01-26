"use client";

import { Typography } from "@/componets/atoms";
import {
  Cards,
  ProductSection,
  WrapperWithBreadcrumb
} from "@/componets/organisms";
import { GET_ALL_PRODUCTS_BY_NAME_QUERY } from "@/query/schema";
import { useLazyQuery } from "@apollo/client";
import { useLocale } from "next-intl";
import { FC, useEffect, useState } from "react";

import { getLocale } from "@/utils/helpers";

interface SearchPageProps {
  label: string;
  value: string;
}

const SearchPage: FC<SearchPageProps> = ({ value, label }) => {
  const [products, setProducts] = useState<any>(null);
  const locale = useLocale();
  const [fetchProducts, { data: currentData, previousData, loading }] =
    useLazyQuery(GET_ALL_PRODUCTS_BY_NAME_QUERY);

  const fetchPaginationProduct = async () => {
    const currentLocale = getLocale({ locale } as { locale: "uk" | "ru" });
    const data = await fetchProducts({
      variables: {
        name: value,
        locale: currentLocale,
        page: currentData?.products?.meta?.pagination?.page + 1
      }
    });
    setProducts((currentProducts: any) => [
      ...(currentProducts || []),
      ...(data.data?.products?.data || [])
    ]);
  };

  useEffect(() => {
    fetchPaginationProduct();
  }, []);

  if (loading) {
    return <Cards />;
  }

  return (
    <WrapperWithBreadcrumb>
      <section className="relative flex flex-col gap-4 w-full">
        <Typography
          className="text-xl text-black font-bold"
          tag="h1"
          text={label}
        />
        {products?.length ? (
          <ProductSection
            data={products}
            fetchPaginationProduct={fetchPaginationProduct}
            paginationData={
              currentData?.products?.meta?.pagination ||
              previousData?.products?.meta?.pagination
            }
          />
        ) : (
          <p>Немає товарів, що відповідали б критеріям пошуку</p>
        )}
      </section>
    </WrapperWithBreadcrumb>
  );
};

export { SearchPage };
