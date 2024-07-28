import { useRouter, useSearchParams, usePathname } from "next/navigation";

const useURLParams = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateURLParams = (
    paramName: string,
    paramValue?: any[] | string | boolean | number
  ) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    if (Array.isArray(paramValue)) {
      if (paramValue.length > 0) {
        current.set(paramName, paramValue.join(","));
      } else {
        current.delete(paramName);
      }
    } else if (paramValue) {
      current.set(paramName, paramValue.toString());
    } else {
      current.delete(paramName);
    }

    const search = current.toString();
    const query = search ? `?${search}` : "";

    router.push(decodeURIComponent(`${pathname}${query}`));
  };

  return { updateURLParams, searchParams };
};

export { useURLParams };
