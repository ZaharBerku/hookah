type FilterValue = string;

type FilterObject = {
  [key: string]: FilterValue | FilterObject;
};

const encodeFilters = (filters: FilterObject): string | null => {
  // if (filters) {
  //   const params = new URLSearchParams();
  //   Object.keys(filters).forEach((key) => {
  //     if (typeof filters[key] === "object" && filters[key] !== null) {
  //       Object.keys(filters[key]).forEach((subKey) => {
  //         params.append(`${key}[${subKey}]`, filters[key][subKey]);
  //       });
  //     } else {
  //       params.append(key, filters[key]);
  //     }
  //   });
  //   return params.toString();
  // }

  return null;
};
