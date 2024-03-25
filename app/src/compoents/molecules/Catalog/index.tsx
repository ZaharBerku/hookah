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
      {open && <div className="fixed inset-0 z-10" onClick={handleToggle}></div>}
      <div className="relative max-w-48 w-full z-20">
        <Button
          onClick={handleToggle}
          full
          color="transparent"
          className={
            "flex gap-2 !bg-catalog text-white hover:!bg-primary-base hover:!border-primary-base"
          }
        >
          <Icon
            className={cx({ "fill-white w-6 h-6": open })}
            type={open ? "CloseIcon" : "DarhboardIcon"}
          />
          Каталог
        </Button>
        {open && <Menu className={"absolute top-full mt-2"} />}
      </div>
    </>
  );
};

export { Catalog };
