"use client";

import { Icon, Portal } from "@/compoents/atoms";
import { BottomSheet } from "@/compoents/molecules";
import { Filter } from "@/compoents/organisms";
import clsx from "clsx";
import { FC, useState, useEffect, useRef } from "react";

interface StickyFilterBarProps {
  fetchFilterProduct: any;
  category: string;
}

const StickyFilterBar: FC<StickyFilterBarProps> = ({
  fetchFilterProduct,
  category
}) => {
  const [open, setOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
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
      <div ref={sentinelRef} className="h-[1px]"></div>
      <div className={"sticky top-[81px] z-40 transition-colors duration-300"}>
        <div
          className={clsx(
            "w-full p-3 relative after:block after:absolute after:left-full  after:w-4 after:bottom-0 after:top-0 before:block before:absolute before:right-full before:w-4 before:bottom-0 before:top-0",
            isSticky
              ? "bg-white after:bg-white before:bg-white shadow-lg shadow-card-shadow-colo"
              : "bg-transparent after:bg-transparent before:bg-transparent"
          )}
        >
          <button
            className="px-3 py-1 items-center rounded-full flex bg-light"
            onClick={handleOpen}
          >
            Фільтр <Icon type="SettingIcon" />
          </button>
          {open && (
            <Portal>
              <BottomSheet onClose={handleClose}>
                <Filter
                  fetchFilterProduct={fetchFilterProduct}
                  category={category}
                   className="!h-[calc(100vh-44px)]"
                />
              </BottomSheet>
            </Portal>
          )}
        </div>
      </div>
    </>
  );
};

export { StickyFilterBar };