type DecodedFilterObject = {
  [key: string]: string | DecodedFilterObject;
};
const decodeFilters = (queryString: string): DecodedFilterObject | null => {
  // const params = new URLSearchParams(queryString);
  // const filters = {};

  // for (const [key, value] of params.entries()) {
  //   const keys = key.match(/[^[\]]+(?=\]?)/g);
  //   if (keys.length > 1) {
  //     if (!filters[keys[0]]) filters[keys[0]] = {};
  //     filters[keys[0]][keys[1]] = value;
  //   } else {
  //     filters[keys[0]] = value;
  //   }
  // }

  return null;
};
