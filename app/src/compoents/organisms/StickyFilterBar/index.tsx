"use client";

import { Icon, Portal } from "@/compoents/atoms";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { FC, useState, useEffect, useRef } from "react";

import { Filter } from "../Filter";

interface StickyFilterBarProps {
  fetchFilterProduct: any;
  defaultPageFitler?: string;
}

const StickyFilterBar: FC<StickyFilterBarProps> = ({
  fetchFilterProduct,
  defaultPageFitler
}) => {
  const t = useTranslations("Filter");
  const [open, setOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSticky(entry.intersectionRatio === 0);
      },
      { threshold: [0, 1], rootMargin: "-81px 0px 0px 0px" }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current);
      }
    };
  }, []);

  return (
    <>
      <div ref={sentinelRef} className="h-px"></div>
      <div
        className={
          "sticky top-[81px] z-40 transition-colors duration-300 block md:hidden"
        }
      >
        <div
          className={clsx(
            "w-full p-3 relative after:block after:absolute after:left-full  after:w-4 after:bottom-0 after:top-0 before:block before:absolute before:right-full before:w-4 before:bottom-0 before:top-0",
            isSticky
              ? "bg-white after:bg-white before:bg-white shadow-lg shadow-card-shadow-colo"
              : "bg-transparent after:bg-transparent before:bg-transparent"
          )}
        >
          <button
            className="px-3 py-1 gap-1 items-center rounded-full flex bg-light"
            onClick={handleOpen}
          >
            {t("title")} <Icon type="SettingIcon" className="w-4 h-4" />
          </button>
        </div>
      </div>
      <Portal>
        <Filter
          fetchFilterProduct={fetchFilterProduct}
          defaultPageFitler={defaultPageFitler}
          className={clsx(
            "!fixed !inset-0 z-[1000] !h-[100dvh] rounded-none -translate-x-full transition-all",
            {
              "!translate-x-0 !w-4/5": open
            }
          )}
          onClose={handleClose}
          isMobile={true}
          open={open}
        />
      </Portal>
    </>
  );
};

export { StickyFilterBar };
