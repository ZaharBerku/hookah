"use client"

import debounce from "debounce";
import { useState, useCallback } from "react";

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
  initialQuery = {},
  asyncFunction
}: AsyncListOptions<T>): AsyncListReturn<T> => {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const debouncedFetch = useCallback(
    debounce(async (query: any) => {
      setIsLoading(true);
      try {
        const data = await asyncFunction({ ...initialQuery, ...query });
        setData(data);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    }, 700),
    []
  );

  return {
    data,
    isLoading,
    error,
    fetch: debouncedFetch
  };
};
export { useAsyncList };
