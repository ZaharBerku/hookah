import { NavListType } from "../types";

const getSelectObject = (
  navList: NavListType[],
  link: string,
  isDeep?: boolean
): NavListType | null => {
  for (let i = 0; i < navList.length; i++) {
    const item = navList[i];
    if (item.link === link) {
      return isDeep ? item : null;
    }
    if (item.list) {
      const found = getSelectObject(item.list, link, true);
      if (found?.link === link) {
        return item;
      } else if (found) {
        return found;
      }
    }
  }
  return null;
};

export { getSelectObject };
