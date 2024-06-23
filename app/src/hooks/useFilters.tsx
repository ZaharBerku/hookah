import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const useFilters = (
  initialFilters: any
): [FilterObject, React.Dispatch<React.SetStateAction<FilterObject>>] => {
  const [filters, setFilters] = useState(initialFilters);
  // const location = useLocation();
  // const history = useHistory();

  // useEffect(() => {
  //   const searchParams = new URLSearchParams(location.search);
  //   const decodedFilters = decodeFilters(searchParams.toString());
  //   setFilters(decodedFilters);
  // }, [location.search]);

  // useEffect(() => {
  //   const queryString = encodeFilters(filters);
  //   history.push({ search: queryString });
  // }, [filters, history]);

  return [filters, setFilters];
};
