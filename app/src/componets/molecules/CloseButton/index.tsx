import { Icon } from "@/componets/atoms";
import clsx from "clsx";
import { FC, MouseEvent, TouchEvent } from "react";

interface CloseButtonPorps {
  onClose?: () => void;
}

const CloseButton: FC<CloseButtonPorps> = ({ onClose }) => {
  if (!onClose) {
    return null;
  }
  const handleClose = (
    event: MouseEvent<HTMLButtonElement> | TouchEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();
    onClose();
  };
  return (
    <button
      onClick={handleClose}
      onTouchEnd={handleClose}
      type="button"
      className={clsx(
        "absolute top-2 right-2 rounded-full hover:bg-white hover:bg-opacity-10 m-1"
      )}
      aria-label="Close"
    >
      <Icon type="CloseIcon" className={"w-6 h-6 fill-black"} />
    </button>
  );
};

export { CloseButton };
