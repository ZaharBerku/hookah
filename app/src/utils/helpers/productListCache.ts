const CACHE_PREFIX = "productListCache::";
const SCROLL_TARGET_KEY = "productListScrollTarget";
const TTL_MS = 10 * 60 * 1000; // 10 minutes

interface ProductListCacheData {
  products: any[];
  pagination: any;
  timestamp: number;
}

export const saveProductListCache = (
  key: string,
  data: { products: any[]; pagination: any }
) => {
  try {
    const cacheData: ProductListCacheData = {
      ...data,
      timestamp: Date.now()
    };
    sessionStorage.setItem(CACHE_PREFIX + key, JSON.stringify(cacheData));
  } catch { /* sessionStorage may be unavailable */ }
};

export const getProductListCache = (
  key: string
): { products: any[]; pagination: any } | null => {
  try {
    const raw = sessionStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;

    const data: ProductListCacheData = JSON.parse(raw);
    if (Date.now() - data.timestamp > TTL_MS) {
      sessionStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }

    return { products: data.products, pagination: data.pagination };
  } catch {
    return null;
  }
};

export const clearProductListCache = (key: string) => {
  try {
    sessionStorage.removeItem(CACHE_PREFIX + key);
  } catch { /* sessionStorage may be unavailable */ }
};

export const saveScrollTarget = (compositeId: string) => {
  try {
    sessionStorage.setItem(SCROLL_TARGET_KEY, compositeId);
  } catch { /* sessionStorage may be unavailable */ }
};

export const consumeScrollTarget = (): string | null => {
  try {
    const target = sessionStorage.getItem(SCROLL_TARGET_KEY);
    if (target) {
      sessionStorage.removeItem(SCROLL_TARGET_KEY);
    }
    return target;
  } catch {
    return null;
  }
};
