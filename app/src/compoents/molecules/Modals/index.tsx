"use client";

import { Icon } from "@/compoents/atoms";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";

import { useStores } from "@/hooks";

import { ModalConfirmAge } from "./ModalConfirmAge";
import { ModalDeleteProductFromCart } from "./ModalDeleteProductFromCart";

const includeModal = {
  ModalDeleteProductFromCart,
  ModalConfirmAge
};

export type ModalType = keyof typeof includeModal;

export default includeModal;

const Modals = observer(() => {
  const { modal } = useStores();
  const [isClient, setState] = useState(false);

  useEffect(() => {
    setState(true);
  }, []);

  if (!isClient) {
    return (
      <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-black bg-opacity-20 z-[1000]">
        <Icon type="SpinnerIcon" />
      </div>
    );
  }

  if (!modal.isOpen && !modal.type) {
    return null;
  }

  const ModalSelected = includeModal[modal.type as ModalType];
  return (
    <ModalSelected
      data={modal.data}
      onClose={modal.closeModal}
      open={modal.isOpen}
    />
  );
});

export { Modals };
