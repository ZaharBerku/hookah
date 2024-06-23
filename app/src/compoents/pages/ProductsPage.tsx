"use client";

import { Icon, Typography } from "@/compoents/atoms";
import { Brands } from "@/compoents/molecules";
import { ProductSection, WrapperWithBreadcrumb } from "@/compoents/organisms";
import { FILTER_PRODUCTS_QUERY } from "@/query/schema";
import { useLazyQuery } from "@apollo/client";
import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { FC, useEffect, useRef, useState, Suspense } from "react";

import { locales } from "@/utils/navigation";

interface ProductsPageProps {
  data: any;
  loading: boolean;
  label: string;
  brands: any;
}

const ProductsPage: FC<ProductsPageProps> = ({
  data,
  label,
  loading,
  brands
}) => {
  const [products, setProducts] = useState(data);
  const locale = useLocale();
  const isMount = useRef(false);
  const searchParams = useSearchParams();
  const [filterProducts, { loading: loadingFilterProducts }] = useLazyQuery(
    FILTER_PRODUCTS_QUERY,
    {
      onCompleted: (result) => {
        setProducts(result?.products?.data || []);
      }
    }
  );
  const currentParams = searchParams.get("brands");

  useEffect(() => {
    if (loading) return; // Exit early if loading

    const currentLocale = locales.includes(locale as "uk" | "ru")
      ? locale
      : "uk";
    if (isMount.current) {
      filterProducts({
        variables: {
          locale: currentLocale,
          filters: {
            brand: {
              id: { in: currentParams?.split(",") }
            }
          },
          limit: 50
        }
      });
    } else {
      isMount.current = true;
    }
  }, [currentParams, locale, loading, filterProducts]);

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
        <Brands brands={brands} />
        {loadingFilterProducts ? (
          <div className="flex justify-center items-center py-36">
            <Icon type="SpinnerIcon" className="w-24 h-24" />
          </div>
        ) : (
          <ProductSection data={products} />
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
