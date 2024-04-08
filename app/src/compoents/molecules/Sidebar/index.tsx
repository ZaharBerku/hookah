"use client";

import { List, Icon, Wrapper } from "@/compoents/atoms";
import { SwitchLanguage } from "@/compoents/molecules";
import cx from "clsx";
import { FC, useState, TouchEvent } from "react";

import { navList } from "@/utils/mock";
import { Link } from "@/utils/navigation";
import { NavListType } from "@/utils/types";

interface SidebarProps {
  isFirstList?: boolean;
  isBannerOpen?: boolean;
}

interface NavListProps extends Omit<SidebarProps, "open" | "isBannerOpen"> {
  list: NavListType[];
}

const NavList: FC<NavListProps> = ({ list, isFirstList }) => {
  const [selectItem, setSelectItem] = useState<NavListType | null>(null);

  const handleTouchEnd =
    (item: NavListType) => (event: TouchEvent<HTMLLIElement>) => {
      event.stopPropagation();
      if (item.list) {
        setSelectItem((currentValue) =>
          JSON.stringify(currentValue) === JSON.stringify(item) ? null : item
        );
      }
    };
  return (
    <>
      <List className="w-full">
        {list.map((item: NavListType, index: number) => {
          const isSelect = selectItem?.link === item.link;
          return (
            <List.Item
              onTouchEnd={handleTouchEnd(item)}
              className={cx(
                "flex flex-col justify-center items-start w-full",
                isFirstList ? "gap-3 py-4 border-b-2 last:border-none" : "gap-1.5 pl-6 pt-1"
              )}
              key={index}
            >
              <div className="flex justify-center items-center gap-2">
                <Link
                  href={item.link}
                  className={cx(
                    "text-black",
                    { "text-primary": isSelect },
                    isFirstList ? "text-xl font-bold" : "text-base"
                  )}
                >
                  {item.name}
                </Link>
                {item.list && (
                  <button>
                    <Icon
                      type="ChevronRightIcon"
                      className={cx(
                        "w-4 h-4 stroke-black group-hover:stroke-primary",
                        {
                          "stroke-primary rotate-90": isSelect
                        },
                        isFirstList ? "stroke-3" : "stroke-2"
                      )}
                    />
                  </button>
                )}
              </div>
              {selectItem?.list && isSelect && (
                <NavList list={selectItem.list} isFirstList={false} />
              )}
            </List.Item>
          );
        })}
      </List>
    </>
  );
};

const Sidebar: FC<SidebarProps> = ({ isBannerOpen }) => {
  const [open, setOpen] = useState<boolean>(false);

  const handleToggle = () => {
    setOpen((currentValue) => !currentValue);
  };

  return (
    <>
      <button
        onClick={handleToggle}
        className="w-11 h-11 flex flex-col gap-1 justify-center md:hidden after:rounded-full before:rounded-full after:bg-black before:bg-black items-center after:h-0.5 after:w-6 before:w-6 before:h-0.5"
      >
        <span className="w-6 h-0.5 rounded-full bg-black"></span>
      </button>
      <aside
        className={cx(
          "fixed -translate-x-full transition-all duration-500 inset-0 bg-light-dark z-50",
          isBannerOpen ? "top-15" : "top-0",
          {
            "translate-x-0": open
          }
        )}
      >
        <Wrapper className="py-5 relative flex flex-col w-full gap-6">
          <button onClick={handleToggle}>
            <Icon
              type="CloseIcon"
              className="fill-black w-6 h-6 absolute right-5 top-6"
            />
          </button>
          <nav className="pt-5">
            <NavList list={navList} isFirstList={true} />
          </nav>
          <SwitchLanguage />
        </Wrapper>
      </aside>
    </>
  );
};

export { Sidebar };
