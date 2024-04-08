"use client";

import { List, Icon } from "@/compoents/atoms";
import cx from "clsx";
import { FC, useState } from "react";

import { navList } from "@/utils/mock";
import { Link } from "@/utils/navigation";
import { NavListType } from "@/utils/types";

interface MenuProps {
  menu?: string;
  className?: string;
}

interface ItemsProps {
  list: NavListType[];
}

const FullList: FC<ItemsProps> = ({ list }) => {
  const [selectItem, setSelectItem] = useState<NavListType | null>(null);

  const handleMouseEnter = (item: NavListType) => () => {
    if (item.list) {
      setSelectItem(item);
    }
  };

  return (
    <>
      <List className={"shadow-3xl shadow-card-shadow-color p-4"}>
        {list.map((item: NavListType, index: number) => {
          const isSelect = selectItem?.link === item.link;
          return (
            <List.Item
              className={
                "relative flex border-b border-black border-opacity-5 last:border-none py-2 first:pt-0 last:pb-0"
              }
              onMouseEnter={handleMouseEnter(item)}
              key={index}
            >
              <Link
                href={item.link}
                className={cx(
                  "font-normal leading-5 group whitespace-nowrap flex gap-3 justify-between items-center text-default hover:text-primary",
                  { "text-primary": isSelect }
                )}
              >
                {item.name}
                {item.list && (
                  <Icon
                    type="ChevronRightIcon"
                    className={cx(
                      "w-4 h-4 stroke-black group-hover:stroke-primary",
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

const Menu: FC<MenuProps> = ({ className }) => {
  if (!navList) {
    return navList;
  }

  return (
    <nav
      className={cx(
        "bg-white flex w-fit rounded-20 shadow-3xl shadow-card-shadow-color overflow-hidden",
        className
      )}
    >
      <FullList list={navList} />
    </nav>
  );
};

export { Menu };
