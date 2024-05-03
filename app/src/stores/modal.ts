import { ModalType } from "@/compoents/molecules/Modals";
import { ModalTypes } from "@/compoents/molecules/Modals";
import { getCookie } from "cookies-next";
import { makeObservable, observable, action } from "mobx";

import { cookiesKeys, modalNames } from "@/utils/variables";

type ModalState = {
  [key in ModalType]?: boolean;
};

type ModalData = {
  [key in ModalType]?: any;
};

type ModalsProps = {
  [key in ModalType]?: ModalTypes;
};

export class Modal {
  types: ModalState | null = null;
  data: ModalData | null = null;
  props: ModalsProps | null = null;

  constructor() {
    makeObservable(this, {
      props: observable,
      types: observable,
      data: observable,
      closeModal: action,
      openModal: action
    });
    this.init();
  }

  openCookieModal = () => {
    const isCookies = getCookie(cookiesKeys.isCookies);
    if (!isCookies) {
      this.types = { ...this.types, ModalCookies: true };
      this.props = {
        [modalNames.ModalCookies]: {
          isStopScroll: true
        }
      };
    }
  };

  init = () => {
    const isAdult = getCookie(cookiesKeys.isAdult);
    if (isAdult !== "true") {
      this.types = { ModalConfirmAge: true };
    } else {
      this.openCookieModal();
    }
  };

  closeModal = (name: ModalType) => {
    if (this.types) {
      const copyTypes = { ...this.types };
      delete copyTypes[name];
      this.types = `${copyTypes}` === "{}" ? null : copyTypes;
    }
    if (this.data) {
      const copyData = { ...this.data };
      delete copyData[name];
      this.data = `${copyData}` === "{}" ? null : copyData;
    }

    if (this.props) {
      const copyProps = { ...this.props };
      delete copyProps[name];
      this.data = `${copyProps}` === "{}" ? null : copyProps;
    }

    //Open Cookie after Confirm Age
    if (modalNames.ModalConfirmAge === name) {
      this.openCookieModal();
    }
  };

  openModal = (name: ModalType) => {
    this.types = { [name]: true, ...this.types };
  };
}
