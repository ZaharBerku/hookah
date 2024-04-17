"use client";

import { List, Icon, Wrapper } from "@/compoents/atoms";
import { SwitchLanguage } from "@/compoents/molecules";
import cx from "clsx";
import { observer } from "mobx-react";
import {
  FC,
  useState,
  TouchEvent,
  Dispatch,
  SetStateAction,
  useEffect
} from "react";

import { useStores } from "@/hooks";
import { getSelectObject } from "@/utils/helpers";
import { navList } from "@/utils/mock";
import { Link } from "@/utils/navigation";
import { NavListType } from "@/utils/types";

interface SidebarProps {
  isCloseBanner?: boolean;
}

interface NavListProps extends Omit<SidebarProps, "open" | "isBannerOpen"> {
  list: NavListType[];
  selectItem: NavListType | null;
  setSelectItem: Dispatch<SetStateAction<NavListType | null>>;
}

const BackItem = ({
  name,
  handleBack
}: {
  name: string;
  handleBack: () => void;
}) => {
  return (
    <button
      onClick={handleBack}
      className="flex items-center gap-2 text-black text-xl font-bold"
    >
      <Icon
        type="ChevronRightIcon"
        className={cx(
          "w-5 h-5 stroke-gray-400 group-hover:stroke-primary rotate-180",
          "stroke-2"
        )}
      />
      <span className="">{name}</span>
    </button>
  );
};

const NavList: FC<NavListProps> = ({ list, selectItem, setSelectItem }) => {
  const handleTouchEnd =
    (item: NavListType) => (event: TouchEvent<HTMLLIElement>) => {
      event.stopPropagation();
      if (item.list) {
        setSelectItem(item);
      }
    };

  return (
    <>
      <List className="w-full">
        {(selectItem?.list || list).map((item: NavListType, index: number) => {
          return (
            <List.Item
              onTouchEnd={handleTouchEnd(item)}
              className={cx(
                "flex flex-col justify-center items-start w-full",
                "gap-3 py-4 border-b-2 last:border-none"
              )}
              key={index}
            >
              <div className="flex w-full justify-between items-center gap-2">
                <Link
                  href={item.link}
                  className={cx("text-black text-xl font-bold", {
                    "!font-normal pl-8": selectItem
                  })}
                >
                  {item.name}
                </Link>
                {item.list && (
                  <button>
                    <Icon
                      type="ChevronRightIcon"
                      className={
                        "w-5 h-5 stroke-black group-hover:stroke-primary stroke-2"
                      }
                    />
                  </button>
                )}
              </div>
            </List.Item>
          );
        })}
      </List>
    </>
  );
};

const Sidebar: FC<SidebarProps> = observer(({ isCloseBanner }) => {
  const [selectItem, setSelectItem] = useState<NavListType | null>(null);

  const [open, setOpen] = useState<boolean>(false);
  const { banner } = useStores();

  const handleToggle = () => {
    setOpen((currentValue) => !currentValue);
  };

  const handleBack = () => {
    setSelectItem((currentSelectItem) => {
      if (currentSelectItem) {
        const previewItem = getSelectObject(navList, currentSelectItem?.link);
        return previewItem;
      } else {
        return currentSelectItem;
      }
    });
  };

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "visible";
      document.body.style.touchAction = "auto";
    }
  }, [open]);

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
          "fixed -translate-x-full block md:hidden transition-all duration-500 inset-0 bg-light-dark z-50",
          banner.isCloseBanner || isCloseBanner ? "top-0" : "top-15",
          {
            "translate-x-0": open
          }
        )}
      >
        <Wrapper className="py-5 relative flex flex-col w-full gap-3">
          <div
            className={cx(
              "flex items-center h-8",
              selectItem ? "justify-between" : "justify-end"
            )}
          >
            {selectItem && (
              <BackItem name={selectItem?.name} handleBack={handleBack} />
            )}
            <button onClick={handleToggle}>
              <Icon type="CloseIcon" className="fill-black w-6 h-6" />
            </button>
          </div>

          <nav>
            <NavList
              list={navList}
              selectItem={selectItem}
              setSelectItem={setSelectItem}
            />
          </nav>
          {!selectItem && <SwitchLanguage />}
        </Wrapper>
      </aside>
    </>
  );
});

export { Sidebar };
