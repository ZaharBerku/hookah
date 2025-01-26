"use client";

import { Modal, Button } from "@/componets/atoms";
import { observer } from "mobx-react-lite";
import { useTranslations } from "next-intl";
import { FC } from "react";

import { useStores } from "@/hooks";

export interface ModalDeleteProductFromCartProps {
  onClose: () => void;
  open: boolean;
  data: { compositeId: string; title?: string; action?: () => void };
}

const ModalDeleteProductFromCart: FC<ModalDeleteProductFromCartProps> =
  observer(({ open, onClose, data }) => {
    const { cart } = useStores();
    const t = useTranslations("ModalDeleteProductFromCart");
    const { title, action } = data;

    const handleDelete = () => {
      if (action) {
        action();
      } else {
        cart.removeProductFromCart(data.compositeId);
      }
      onClose();
    };

    return (
      <Modal
        classes={{
          container: "flex flex-col w-full gap-6 max-w-2xl",
          background: "!z-[1099]",
          wrapper: "!z-[1100]"
        }}
        open={open}
        onClose={onClose}
      >
        <Modal.Header onClose={onClose}>
          <h3 className="text-black text-xl text-center font-bold">
            {title || t("confirmation")}
          </h3>
        </Modal.Header>
        <Modal.Body className="flex gap-2.5">
          <Button onClick={onClose} full color="second">
            {t("buttons.cancel")}
          </Button>
          <Button onClick={handleDelete} full>
            {t("buttons.delete")}
          </Button>
        </Modal.Body>
      </Modal>
    );
  });

export { ModalDeleteProductFromCart };
