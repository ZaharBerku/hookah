"use client";

import { Modal, Button } from "@/compoents/atoms";
import { observer } from "mobx-react-lite";
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
            {title || "Ви впевнені, що хочете видалити товар?"}
          </h3>
        </Modal.Header>
        <Modal.Body className="flex gap-2.5">
          <Button onClick={onClose} full color="second">
            Відміна
          </Button>
          <Button onClick={handleDelete} full>
            Видалити
          </Button>
        </Modal.Body>
      </Modal>
    );
  });

export { ModalDeleteProductFromCart };
