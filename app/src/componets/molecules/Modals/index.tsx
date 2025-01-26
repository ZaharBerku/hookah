"use client";

import { Icon } from "@/componets/atoms";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { FC } from "react";

import { useStores } from "@/hooks";

import {
  ModalCompletionOrder,
  ModalCompletionOrderProps
} from "./ModalCompletionOrder";
import { ModalConfirmAge, ModalConfirmAgeProps } from "./ModalConfirmAge";
import { ModalCookies, ModalCookiesProps } from "./ModalCookies";
import {
  ModalDeleteProductFromCart,
  ModalDeleteProductFromCartProps
} from "./ModalDeleteProductFromCart";
import { ModalFilter, ModalFilterProps } from "./ModalFilter";
import {
  ModalProductAddToCart,
  ModalProductAddToCartProps
} from "./ModalProductAddToCart";

const includeModal = {
  ModalDeleteProductFromCart,
  ModalConfirmAge,
  ModalCookies,
  ModalCompletionOrder,
  ModalProductAddToCart,
  ModalFilter
};

export type ModalTypes =
  | ModalConfirmAgeProps
  | ModalCookiesProps
  | ModalDeleteProductFromCartProps
  | ModalCompletionOrderProps
  | ModalProductAddToCartProps
  | ModalFilterProps;

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

  if (!isClient || modal.isShowSpinner) {
    return (
      <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-black bg-opacity-20 z-[1000]">
        <Icon type="SpinnerIcon" className="w-20 h-20 animate-spin" />
      </div>
    );
  }

  if (!modal.types) {
    return null;
  }

  return (
    <>
      {(Object.entries(modal.types) as [ModalType, boolean][]).map(
        ([name, isOpen]) => {
          return (
            <ModalComponent
              key={name}
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
