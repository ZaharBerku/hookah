import { ModalType } from "@/compoents/molecules/Modals";

// Cookies Keys
export const cookiesKeys = {
  isCloseBanner: "is_close_banner",
  isAdult: "is_adult",
  isCookies: "is_cookies"
};

// Local Storage Keys

export const localStorageKeys = {
  cart: "cart",
  likes: "likes"
};

export const modalNames: { [key in ModalType]: ModalType } = {
  ModalConfirmAge: "ModalConfirmAge",
  ModalCookies: "ModalCookies",
  ModalDeleteProductFromCart: "ModalDeleteProductFromCart"
};
