import { useSearchParams } from "next/navigation";

const parseValue = (value: string) => {
  value = value.trim();
  if (value === "true") {
    return true;
  }
  if (value === "false") {
    return false;
  }
  const num = parseFloat(value);
  if (!isNaN(num)) {
    return num;
  }
  return value;
};

const transformObject = (obj: any) => {
  const result = {};

  Object.entries(obj).forEach(([key, value]: any) => {
    const keys = key.split(".");
    keys.reduce((acc: any, k: string, i: number) => {
      if (i === keys.length - 1) {
        acc[k] = value.split(",").map(parseValue);
      } else {
        acc[k] = acc[k] || {};
      }
      return acc[k];
    }, result);
  });

  return result;
};

function useGetAllSearchParams() {
  const searchParams = useSearchParams();

  return transformObject(Object.fromEntries(searchParams.entries()));
}

export { useGetAllSearchParams };
