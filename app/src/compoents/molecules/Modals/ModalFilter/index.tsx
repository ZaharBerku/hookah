"use client";

import { Modal } from "@/compoents/atoms";
import { Filter } from "@/compoents/organisms";
import { FC, PropsWithChildren } from "react";

export interface ModalFilterProps extends PropsWithChildren {
  onClose: () => void;
  open: boolean;
  data: any;
}

const ModalFilter: FC<ModalFilterProps> = ({ open, onClose, data }) => {
  return (
    <Modal
      classes={{
        container:
          "flex flex-col w-full gap-6 max-w-full rounded-none h-[100dvh] max-h-full !px-0 overflow-hidden",
        wrapper:
          "!px-0 !top-0 !bottom-0 translate-x-0 translate-y-0 !left-auto transition-all"
      }}
      open={open}
      onClose={onClose}
    >
      <Modal.Header
        classes={{
          wrapperHeader: "flex justify-start flex-col items-start px-5"
        }}
        onClose={onClose}
      >
        <h3 className="text-black text-xl text-center font-bold">Фільтри</h3>
      </Modal.Header>
      <Modal.Body>
        <Filter
          fetchFilterProduct={data.fetchFilterProduct}
          category={data.category}
          className="!h-[calc(100dvh-70px)]"
        />
      </Modal.Body>
    </Modal>
  );
};

export { ModalFilter };
