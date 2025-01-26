"use client";

import clsx from "clsx";
import { FC, PropsWithChildren, useEffect } from "react";

import { useBottomSheet } from "@/hooks";

interface BottomSheetProps extends PropsWithChildren {
  onClose: () => void;
}

const BottomSheet: FC<BottomSheetProps> = ({ children, onClose }) => {
  const {
    showBottom,
    sheetHeight,
    handleStart,
    handleClose,
    handlePointerDown
  } = useBottomSheet(onClose);

  useEffect(() => {
    handleStart();
  }, []);

  if (!showBottom) {
    return null;
  }

  return (
    <>
      {showBottom && (
        <div
          onClick={handleClose}
          className="fixed inset-0 backdrop-blur-md bg-black bg-opacity-20 z-[1000] block"
        ></div>
      )}
      <div
        style={{
          height: `${sheetHeight}%`
        }}
        className={clsx(
          "fixed bottom-0 right-0 left-0 top-auto h-full w-full z-[1001] bg-white rounded-t-2xl transition-height block"
        )}
      >
        <div className="flex justify-center items-center h-11">
          <button
            className="p-2 select-none bg-light-dark-accent rounded-full w-15"
            onPointerDown={handlePointerDown}
          />
        </div>
        <div>{children}</div>
      </div>
    </>
  );
};

export { BottomSheet };
