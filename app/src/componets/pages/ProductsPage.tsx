"use client";

import { Typography } from "@/componets/atoms";
import { DynamicLinkListList } from "@/componets/molecules";
import {
  ProductSection,
  WrapperWithBreadcrumb,
  WrapperProductWithFilter,
  Cards
} from "@/componets/organisms";
import { GET_PRODUCTS_QUERY } from "@/query/schema";
import { useLazyQuery } from "@apollo/client";
import { useLocale } from "next-intl";
import {
  FC,
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  Suspense,
  useCallback
} from "react";
import toast from "react-hot-toast";

import { useGetAllSearchParams, useProductListCache } from "@/hooks";
import { getLocale } from "@/utils/helpers";
import { CategoryType } from "@/utils/types";

interface ProductsPageProps {
  label: string;
  category?: CategoryType;
  defaultFilter?: any;
  defaultPageFilter?: string;
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
  defaultFilter,
  defaultPageFilter
}) => {
  const initialVariables = useGetAllSearchParams();
  const [products, setProducts] = useState<any>(null);
  const [paginationMeta, setPaginationMeta] = useState<any>(null);
  const locale = useLocale();
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  const [fetchProducts] = useLazyQuery(quary);
  const pendingScrollRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    if (pendingScrollRef.current !== null) {
      window.scrollTo(0, pendingScrollRef.current);
      pendingScrollRef.current = null;
    }
  }, [products]);

  const fetchPaginationProduct = async () => {
    pendingScrollRef.current = window.scrollY;
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
        page: (paginationMeta?.page ?? 0) + 1
      }
    });
    const newPagination = data.data.products.meta.pagination;
    setPaginationMeta(newPagination);
    setProducts((currentProducts: any) => [
      ...(currentProducts || []),
      ...data.data.products.data
    ]);
  };

  const fetchFilterProduct = useCallback(
    async (values?: any) => {
      setIsLoadingProducts(true);
      const currentLocale = getLocale({ locale } as { locale: "uk" | "ru" });
      try {
        const data = await fetchProducts({
          variables: {
            locale: currentLocale,
            filters: {
              category: { name: { eq: category } },
              type: { slugType: { eq: type } },
              ...defaultFilter,
              ...values
            }
          }
        });
        const newPagination = data.data.products.meta.pagination;
        setPaginationMeta(newPagination);
        setProducts(data.data.products.data);
      } catch (error) {
        toast.error("Щось пішло не так! Спробуйте ще раз)");
      } finally {
        setIsLoadingProducts(false);
      }
    },
    [locale, category, type, defaultFilter]
  );

  const { updateCache, invalidateCache } = useProductListCache({
    setProducts,
    setPaginationMeta,
    fetchFilterProduct,
    initialVariables
  });

  useEffect(() => {
    if (products && paginationMeta) {
      updateCache(products, paginationMeta);
    }
  }, [products, paginationMeta]);

  const handleFetchFilterProduct = async (values?: any) => {
    invalidateCache();
    await fetchFilterProduct(values);
  };

  if (loading) {
    return <Cards />;
  }

  return (
    <WrapperWithBreadcrumb>
      <section className="relative flex flex-col gap-4 w-full">
        <Typography
          className="text-xl text-black font-bold select-none"
          tag="h2"
          text={label}
        />

        {category && (
          <DynamicLinkListList
            list={list}
            type={type}
            category={category as CategoryType}
          />
        )}

        <WrapperProductWithFilter
          fetchFilterProduct={handleFetchFilterProduct}
          defaultPageFilter={defaultPageFilter}
        >
          {isLoadingProducts || !products ? (
            <Cards />
          ) : (
            <ProductSection
              data={products}
              fetchPaginationProduct={fetchPaginationProduct}
              paginationData={paginationMeta}
            />
          )}
        </WrapperProductWithFilter>
      </section>
    </WrapperWithBreadcrumb>
  );
};

const SuspendedProductsPage: FC<ProductsPageProps> = (props) => {
  return (
    <Suspense fallback={<Cards />}>
      <ProductsPage {...props} />
    </Suspense>
  );
};
export { SuspendedProductsPage as ProductsPage };
