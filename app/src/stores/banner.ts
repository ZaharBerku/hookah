import { getCookie, setCookie } from "cookies-next";
import { makeObservable, observable, action } from "mobx";

import { cookiesKeys } from "@/utils/variables";

export class Banner {
  isCloseBanner: boolean = true;

  constructor() {
    makeObservable(this, {
      isCloseBanner: observable,
      closeBanner: action
    });
    this.init();
  }

  init = () => {
    const value = getCookie(cookiesKeys.isCloseBanner);
    this.isCloseBanner = value === "true";
  };

  setCookieValueWithAge = () => {
    const TWO_DAYS = 60 * 60 * 48;
    setCookie(cookiesKeys.isCloseBanner, `${this.isCloseBanner}`, {
      maxAge: TWO_DAYS
    });
  };

  closeBanner = () => {
    this.isCloseBanner = !this.isCloseBanner;
    this.setCookieValueWithAge();
  };
}
