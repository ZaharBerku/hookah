import { List } from "@/compoents/atoms";
import { DropdownMenu } from "@/compoents/molecules";
import Link from "next/link";
import { FC } from "react";

interface MenuProps {
  menu: string;
}

interface ItemsProps {
  list: string[];
}

const Items: FC<ItemsProps> = ({ list }) => {
  return (
    <>
      {list.map((item, index) => {
        const [name, sublist] = item.split(":");
        const [label, link] = name.split("+");
        return (
          <List.Item key={index}>
            {sublist ? (
              <DropdownMenu list={sublist.split(" ")} label={name} />
            ) : (
              <Link className="text-xs text-black" href={`/${link}`}>
                {label}
              </Link>
            )}
          </List.Item>
        );
      })}
    </>
  );
};

const Menu: FC<MenuProps> = ({ menu }) => {
  if (!menu) {
    return menu;
  }
  const list = menu.split(",");
  return (
    <nav className="bg-white">
      <List className="flex">
        <Items list={list} />
      </List>
    </nav>
  );
};

export { Menu };
