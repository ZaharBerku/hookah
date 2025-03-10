import { ModalType } from "@/componets/molecules/Modals";

// Search params
export const searchParamKeys = {
  brands: "brands"
};

// Cookies Keys
export const cookiesKeys = {
  isCloseBanner: "is_close_banner",
  isAdult: "is_adult",
  isCookies: "is_cookies",
  promocode: "promocode"
};

// Local Storage Keys

export const localStorageKeys = {
  cart: "cart",
  likes: "likes"
};

export const modalNames: { [key in ModalType]: ModalType } = {
  ModalCompletionOrder: "ModalCompletionOrder",
  ModalConfirmAge: "ModalConfirmAge",
  ModalCookies: "ModalCookies",
  ModalDeleteProductFromCart: "ModalDeleteProductFromCart",
  ModalProductAddToCart: "ModalProductAddToCart",
  ModalFilter: "ModalFilter"
};

export const pages = [
  "tobacco",
  "search",
  "hookah",
  "cart",
  "checkout",
  "brand",
  "coal",
  "gorihove",
  "kokosove",
  "kalaudi",
  "kolbi",
  "mundshtuki",
  "personalni-mundshtuki",
  "chasha",
  "shlangi",
  "shhipczi",
  "accessory"
];
