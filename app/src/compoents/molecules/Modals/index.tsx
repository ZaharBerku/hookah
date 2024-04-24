"use client";

import { observer } from "mobx-react-lite";

import { useStores } from "@/hooks";

import { ModalDeleteProductFromCart } from "./ModalDeleteProductFromCart";

const includeModal = {
  ModalDeleteProductFromCart
};

export type ModalType = keyof typeof includeModal;

export default includeModal;

const Modals = observer(() => {
  const { modal } = useStores();
  if (!modal.isOpen && !modal.type) {
    return null;
  }
  const ModalSelected = includeModal[modal.type as ModalType];
  return <ModalSelected data={modal.data} onClose={modal.closeModal} open={modal.isOpen} />;
});

export { Modals };
