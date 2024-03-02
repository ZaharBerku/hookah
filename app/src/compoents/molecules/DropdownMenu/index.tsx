import { List, Button, Icon } from "@/compoents/atoms";
import clsx from "clsx";
import Link from "next/link";
import { FC } from "react";

interface DropdownMenuProps {
  list: string[];
  label: string;
  classes?: any;
}

const DropdownMenu: FC<DropdownMenuProps> = ({ list, label, classes }) => {
  return (
    <div className={clsx("relate w-full", classes?.wrapper)}>
      <Button
        color="transparent"
        icons={{
          iconRight: (
            <Icon type="ChevronDownIcon" className="w-4 h-4 fill-black" />
          )
        }}
        full
        className={classes?.trigger}
      >
        {label}
      </Button>
      <List className="absolute top-[calc(100%+5px)] w-full">
        {list.map((item, index) => {
          const [label, link] = item.split("+");
          return (
            <List.Item key={index}>
              <Link href={`/${link}`}>{label}</Link>
            </List.Item>
          );
        })}
      </List>
    </div>
  );
};

export { DropdownMenu };
