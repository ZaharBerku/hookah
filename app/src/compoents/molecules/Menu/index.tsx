"use client";

import { List, Icon } from "@/compoents/atoms";
import cx from "clsx";
import { FC, useEffect, useState } from "react";
import { navList } from "@/utils/mock";
import { Link } from "@/utils/navigation";
import { NavListType } from "@/utils/types";

interface MenuProps {
  menu?: string;
  classes?: {
    wrapper?: string;
    list?: string;
  };
}

interface ItemsProps {
  list: NavListType[];
  isReset?: boolean;
  className?: string;
}

const FullList: FC<ItemsProps> = ({ list, className, isReset }) => {
  const [selectItem, setSelectItem] = useState<NavListType | null>(null);

  const handleMouseEnter = (item: NavListType) => () => {
    if (item.list) {
      setSelectItem(item);
    }
  };

  const handleMouseEnterList = () => {
    if (selectItem) {
      setSelectItem(null);
    }
  };

  useEffect(() => {
    if (isReset) {
      setSelectItem(null);
    }
  }, [isReset]);

  return (
    <>
      <List
        onMouseEnter={handleMouseEnterList}
        className={cx("w-full py-4 px-6 border-r last:border-none", className)}
      >
        {list.map((item: NavListType, index: number) => {
          const isSelect = selectItem?.link === item.link;
          return (
            <List.Item
              className={
                "relative flex border-b border-black border-opacity-5 last:border-none py-4 first:pt-0 last:pb-0"
              }
              onMouseEnter={handleMouseEnter(item)}
              key={index}
            >
              <Link
                href={item.link}
                className={cx(
                  "text-black text-base leading-5 group whitespace-nowrap w-full flex gap-3 justify-between items-center hover:text-primary",
                  { "text-primary": isSelect }
                )}
              >
                {item.name}
                {item.list && (
                  <Icon
                    type="ChevronRightIcon"
                    className={cx(
                      "w-5 h-5 stroke-black group-hover:stroke-primary stroke-2",
                      {
                        "stroke-primary": isSelect
                      }
                    )}
                  />
                )}
              </Link>
            </List.Item>
          );
        })}
      </List>
      {selectItem?.list && <FullList list={selectItem.list} />}
    </>
  );
};

const Menu: FC<MenuProps> = ({ classes }) => {
  const [isReset, setIsReset] = useState(false);

  if (!navList) {
    return navList;
  }

  const handleMouseLeave = () => {
    setIsReset(true);
  };

  const handleMouseEnter = () => {
    setIsReset(false);
  };

  return (
    <nav
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      className={cx(
        "bg-white flex w-fit rounded-2xl border py-2 border-black border-opacity-10 overflow-hidden shadow-3xl shadow-card-shadow-color",
        classes?.wrapper
      )}
    >
      <FullList list={navList} className={classes?.list} isReset={isReset} />
    </nav>
  );
};

export { Menu };
