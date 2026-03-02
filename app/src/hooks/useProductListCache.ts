"use client";

import { useCallback, useEffect, useRef } from "react";

import {
  saveProductListCache,
  getProductListCache,
  clearProductListCache,
  consumeScrollTarget
} from "@/utils/helpers";
import { usePathname } from "@/utils/navigation";

interface UseProductListCacheOptions {
  setProducts: (products: any[]) => void;
  setPaginationMeta: (pagination: any) => void;
  fetchFilterProduct: (values?: any) => Promise<void>;
  initialVariables: any;
}

export const useProductListCache = ({
  setProducts,
  setPaginationMeta,
  fetchFilterProduct,
  initialVariables
}: UseProductListCacheOptions) => {
  const pathname = usePathname();
  const restoredRef = useRef(false);

  const getCacheKey = useCallback(() => {
    const search = typeof window !== "undefined" ? window.location.search : "";
    return `${pathname}${search}`;
  }, [pathname]);

  const updateCache = useCallback(
    (products: any[], pagination: any) => {
      if (products && pagination) {
        saveProductListCache(getCacheKey(), { products, pagination });
      }
    },
    [getCacheKey]
  );

  const invalidateCache = useCallback(() => {
    clearProductListCache(getCacheKey());
  }, [getCacheKey]);

  useEffect(() => {
    const cacheKey = getCacheKey();
    const cached = getProductListCache(cacheKey);

    if (cached) {
      restoredRef.current = true;
      setProducts(cached.products);
      setPaginationMeta(cached.pagination);

      requestAnimationFrame(() => {
        const scrollTarget = consumeScrollTarget();
        if (scrollTarget) {
          const el = document.querySelector(
            `[data-composite-id="${scrollTarget}"]`
          );
          if (el) {
            el.scrollIntoView({ block: "center" });
            return;
          }
        }
      });
    } else {
      restoredRef.current = false;
      fetchFilterProduct(initialVariables);
      window.scrollTo(0, 0);
    }
  }, []);

  return { updateCache, invalidateCache, restoredRef };
};
