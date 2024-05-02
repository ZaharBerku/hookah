import { ModalType } from "@/compoents/molecules/Modals";
import { getCookie } from "cookies-next";
import { makeObservable, observable, action } from "mobx";

import { cookiesKeys } from "@/utils/variables";

export class Modal {
  isOpen: boolean = false;
  type: ModalType | null = null;
  data: any = null;

  constructor() {
    makeObservable(this, {
      isOpen: observable,
      type: observable,
      data: observable,
      closeModal: action,
      openModal: action,
      toggleModal: action
    });
    this.init();
  }

  init = () => {
    const isAdult = getCookie(cookiesKeys.isAdult);
    if (isAdult !== "true") {
      this.type = "ModalConfirmAge";
      this.isOpen = true;
    }
  };

  closeModal = () => {
    this.type = null;
    this.isOpen = false;
    this.data = null;
  };

  openModal = (name: ModalType) => {
    this.type = name;
    this.isOpen = true;
  };

  toggleModal = (name: ModalType) => {
    this.isOpen = !this.isOpen;
    this.type = this.isOpen ? name : null;
  };
}
