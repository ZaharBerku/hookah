import { Icon } from "@/compoents/atoms";
import clsx from "clsx";
import { FC, PropsWithChildren } from "react";

interface ModalFooterProps extends PropsWithChildren {
  onClose?: () => void;
  classes?: {
    wrapperHeader?: string;
    close?: string;
  };
  displayName?: string;
}

const ModalHeader: FC<ModalFooterProps> = ({ children, classes, onClose }) => {
  return (
    <div className={clsx("w-full", classes?.wrapperHeader)}>
      {onClose && (
        <button
          onClick={onClose}
          onTouchEnd={onClose}
          className={clsx(
            "absolute top-2 right-2 rounded-full hover:bg-white hover:bg-opacity-10 m-1",
            classes?.close
          )}
          aria-label="Close"
        >
          <Icon type="CloseIcon" className={"w-6 h-6 fill-black"} />
        </button>
      )}

      {children}
    </div>
  );
};

export { ModalHeader };
