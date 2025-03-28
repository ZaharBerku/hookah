"use client";

import { Button, Icon } from "@/componets/atoms";
import { Menu } from "@/componets/molecules";
import cx from "clsx";
import { useState } from "react";

import { useMediaQuery } from "@/hooks";

const Catalog = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen((currentValue) => !currentValue);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (isMobile) {
    return null;
  }

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-10" onClick={handleToggle}></div>
      )}
      <div className="relative max-w-36 w-full z-20">
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
            handleClose={handleClose}
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
