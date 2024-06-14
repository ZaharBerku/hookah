"use client";

import { Button, Icon } from "@/compoents/atoms";
import { Menu } from "@/compoents/molecules";
import cx from "clsx";
import { useState } from "react";

const Catalog = () => {
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen((currentValue) => !currentValue);
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-10" onClick={handleToggle}></div>
      )}
      <div className="relative max-w-36 w-full z-20 hidden md:block">
        <Button
          onClick={handleToggle}
          color="transparent"
          className={
            "flex gap-2 rounded-md px-4 !bg-catalog text-white hover:!bg-primary-base hover:!border-primary-base"
          }
        >
          <Icon
            className={cx({ "fill-white w-6 h-6": open })}
            type={open ? "CloseIcon" : "DarhboardIcon"}
          />
          Каталог
        </Button>
        {open && (
          <Menu
            classes={{
              wrapper: "absolute top-full mt-2 min-w-74",
              list: "min-w-74"
            }}
          />
        )}
      </div>
    </>
  );
};

export { Catalog };
