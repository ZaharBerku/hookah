"use client";

import { Icon } from "@/compoents/atoms";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { FC } from "react";

import { useStores } from "@/hooks";

import { ModalConfirmAge, ModalConfirmAgeProps } from "./ModalConfirmAge";
import { ModalCookies, ModalCookiesProps } from "./ModalCookies";
import {
  ModalDeleteProductFromCart,
  ModalDeleteProductFromCartProps
} from "./ModalDeleteProductFromCart";

const includeModal = {
  ModalDeleteProductFromCart,
  ModalConfirmAge,
  ModalCookies
};

export type ModalTypes =
  | ModalConfirmAgeProps
  | ModalCookiesProps
  | ModalDeleteProductFromCartProps;

export type ModalType = keyof typeof includeModal;

type ModalComponentProps = {
  name: ModalType;
  data: any;
  closeModal: (name: ModalType) => void;
  isOpen: boolean;
  modalProps?: ModalTypes;
};

export default includeModal;

const ModalComponent: FC<ModalComponentProps> = ({
  name,
  data,
  closeModal,
  isOpen,
  modalProps
}) => {
  const ModalSelected = includeModal[name];
  return (
    <ModalSelected
      data={data}
      onClose={() => closeModal(name)}
      open={isOpen}
      {...modalProps}
    />
  );
};

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

  if (!modal.types) {
    return null;
  }

  return (
    <>
      {(Object.entries(modal.types) as [ModalType, boolean][]).map(
        ([name, isOpen], index: number) => {
          console.log(Object.assign({}, modal.data), "modal");
          return (
            <ModalComponent
              key={index}
              name={name}
              isOpen={isOpen}
              data={modal.data?.[name]}
              modalProps={modal.props?.[name]}
              closeModal={modal.closeModal}
            />
          );
        }
      )}
    </>
  );
});

export { Modals };
