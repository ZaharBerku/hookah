"use client";

import clsx from "clsx";
import { FC, ReactNode, useEffect, MouseEvent, TouchEvent } from "react";

import { ModalBody } from "./ModalBody";
import { ModalFooter } from "./ModalFooter";
import { ModalHeader } from "./ModalHeader";

interface ModalComponentProps {
  children: ReactNode;
  onClose: () => void;
  open: boolean;
  classes?: {
    wrapper?: string;
    container?: string;
  };
}

interface ModalComponentType extends ModalComponentProps {
  displayName?: string;
}

const ModalComponent: FC<ModalComponentType> = ({
  children,
  classes,
  onClose,
  open
}) => {
  const handleClick = (
    event: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>
  ) => {
    event.stopPropagation();
  };

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "visible";
      document.body.style.touchAction = "auto";
    }
    return () => {
      document.body.style.overflow = "visible";
      document.body.style.touchAction = "auto";
    };
  }, [open]);

  if (!open) {
    return null;
  }
  return (
    <>
      <div
        onClick={() => onClose && onClose()}
        // onTouchEnd={() => onClose && onClose()}
        className={clsx(
          "fixed inset-0 blur-lg bg-black bg-opacity-20 z-[1000]",
          classes?.wrapper
        )}
      ></div>

      <div
        onClick={handleClick}
        // onTouchEnd={handleClick}
        // onTouchStart={handleClick}
        className={clsx(
          "w-11/12 md:w-full max-h-11/12 fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[1001] py-6 px-8 md:px-12 md:py-8 rounded-3xl bg-white overflow-auto",
          classes?.container
        )}
        role="dialog"
        aria-labelledby="modal"
      >
        {children}
      </div>
    </>
  );
};

ModalComponent.displayName = "Modal";
ModalHeader.displayName = "Modal.Header";
ModalBody.displayName = "Modal.Body";
ModalFooter.displayName = "Modal.Footer";

export const Modal = Object.assign(ModalComponent, {
  Header: ModalHeader,
  Body: ModalBody,
  Footer: ModalHeader
});
