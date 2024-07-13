"use client";

import { Icon, Typography } from "@/compoents/atoms";
import { Brands } from "@/compoents/molecules";
import { ProductSection, WrapperWithBreadcrumb } from "@/compoents/organisms";
import { GET_PRODUCTS_QUERY } from "@/query/schema";
import { useLazyQuery } from "@apollo/client";
import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { FC, useState, Suspense, useEffect } from "react";

import { getLocale } from "@/utils/helpers";
import { Category } from "@/utils/types";

interface ProductsPageProps {
  loading: boolean;
  label: string;
  brands: any;
}

const ProductsPage: FC<ProductsPageProps> = ({ label, loading, brands }) => {
  const [products, setProducts] = useState<any>(null);
  const locale = useLocale();
  const searchParams = useSearchParams();
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [fetchProducts, { data: currentData, previousData }] =
    useLazyQuery(GET_PRODUCTS_QUERY);

  const currentParams = searchParams.get("brands");

  const fetchPaginationProduct = async () => {
    const currentLocale = getLocale({ locale } as { locale: "uk" | "ru" });
    const data = await fetchProducts({
      variables: {
        locale: currentLocale,
        filters: {
          brand: {
            id: { in: currentParams?.split(",") }
          },
          category: { name: { eq: Category.TOBACCO } }
        },
        page: currentData?.products?.meta?.pagination?.page + 1
      }
    });
    setProducts((currentProducts: any) => [
      ...currentProducts,
      ...data.data.products.data
    ]);
  };

  const fetchFilterProduct = async (selectedBrands?: string[]) => {
    setIsLoadingProducts(true);
    const currentLocale = getLocale({ locale } as { locale: "uk" | "ru" });
    const data = await fetchProducts({
      variables: {
        locale: currentLocale,
        filters: {
          brand: {
            id: { in: selectedBrands }
          },
          category: { name: { eq: Category.TOBACCO } }
        }
      }
    });
    setProducts(data.data.products.data);
    setIsLoadingProducts(false);
  };

  useEffect(() => {
    fetchFilterProduct();
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
        <Brands brands={brands} fetchFilterProduct={fetchFilterProduct} />
        {isLoadingProducts || !products ? (
          <div className="flex justify-center items-center py-36">
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
