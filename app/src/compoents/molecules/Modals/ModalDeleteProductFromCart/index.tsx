"use client";

import { Modal, Button } from "@/compoents/atoms";
import { observer } from "mobx-react-lite";
import { FC } from "react";

import { useStores } from "@/hooks";

export interface ModalDeleteProductFromCartProps {
  onClose: () => void;
  open: boolean;
  data: { compositeId: string };
}

const ModalDeleteProductFromCart: FC<ModalDeleteProductFromCartProps> =
  observer(({ open, onClose, data }) => {
    const { cart } = useStores();

    const handleDelete = () => {
      cart.removeProductFromCart(data.compositeId);
      onClose();
    };

    return (
      <Modal
        classes={{
          container: "flex flex-col w-full gap-6 max-w-2xl"
        }}
        open={open}
        onClose={onClose}
      >
        <Modal.Header onClose={onClose}>
          <h3 className="text-black text-xl text-center font-bold">
            Ви впевнені, що хочете видалити товар?
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
