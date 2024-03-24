"use client";

import { List, Icon } from "@/compoents/atoms";
import cx from "clsx";
import { FC, useState } from "react";

import { Link } from "@/utils/navigation";

interface MenuProps {
  menu?: string;
  className?: string;
}

interface ItemsProps {
  menu: any;
  isStartList: boolean;
}

const FullList: FC<ItemsProps> = ({ menu, isStartList }) => {
  const [selectItem, setSelectItem] = useState<any>(null);

  return (
    <>
      <List
        className={cx(
          "shadow-3xl shadow-card-shadow-color",
          isStartList ? "py-5 px-6" : "p-6"
        )}
      >
        {menu.map((item: any, index: number) => {
          const isSelect = selectItem?.link === item.link;
          return (
            <List.Item
              className={cx(
                "relative flex",
                isStartList
                  ? "border-b border-black border-opacity-5 last:border-none py-4 first:pt-0 last:pb-0"
                  : "py-2"
              )}
              onMouseEnter={() => {
                if (item.list) {
                  setSelectItem(item);
                }
              }}
              key={index}
            >
              <Link
                href={item.link}
                className={cx(
                  "font-bold leading-5 group whitespace-nowrap flex gap-3 justify-between items-center hover:text-primary",
                  isStartList ? "text-xl" : "text-base",
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
      {selectItem?.list && (
        <FullList menu={selectItem.list} isStartList={false} />
      )}
    </>
  );
};

const menu = [
  {
    name: "Кальяни 1",
    link: "/hook",
    list: [
      {
        name: "Колауди1",
        link: "/test",
        list: [
          {
            name: "Горіхове1",
            link: "/test2"
          }
        ]
      },
      {
        name: "Колауди2",
        link: "/test",
        list: [
          {
            name: "Горіхове2",
            link: "/test2"
          }
        ]
      }
    ]
  },
  {
    name: "Кальяни 2",
    link: "/hook2",
    list: [
      {
        name: "Колауди",
        link: "/test",
        list: [
          {
            name: "Горіхове",
            link: "/test2"
          }
        ]
      },
      {
        name: "Колауди",
        link: "/test",
        list: [
          {
            name: "Горіхове",
            link: "/test2"
          }
        ]
      }
    ]
  }
];

const Menu: FC<MenuProps> = ({ className }) => {
  if (!menu) {
    return menu;
  }

  return (
    <nav
      className={cx(
        "bg-white flex w-fit rounded-20 shadow-3xl shadow-card-shadow-color overflow-hidden",
        className
      )}
    >
      <FullList menu={menu} isStartList={true} />
    </nav>
  );
};

export { Menu };
