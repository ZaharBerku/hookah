import { debounce } from "lodash";
import { useState, useEffect, useCallback } from "react";

interface AsyncListOptions<T> {
  initialQuery?: any;
  asyncFunction: (query: any) => any;
}

interface AsyncListReturn<T> {
  data: T[];
  isLoading: boolean;
  error: Error | null;
  fetch: (query: any) => void;
}

const useAsyncList = <T,>({
  initialQuery,
  asyncFunction
}: AsyncListOptions<T>): AsyncListReturn<T> => {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setisLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const debouncedFetch = useCallback(
    debounce(async (query: any) => {
      setisLoading(true);
      try {
        const data = await asyncFunction({ ...initialQuery, ...query });
        setData(data);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setisLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    debouncedFetch(initialQuery);
  }, []);

  return {
    data,
    isLoading,
    error,
    fetch: debouncedFetch
  };
};
export { useAsyncList };
