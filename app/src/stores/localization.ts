import { makeAutoObservable } from "mobx";

import { getLocale } from "@/utils/helpers";
import { defaultLocale } from "@/utils/navigation";
import { LocalizationType } from "@/utils/types";

export class Localization {
  locale: LocalizationType = defaultLocale;

  constructor() {
    makeAutoObservable(this);
  }

  setLocale(locale: LocalizationType) {
    this.locale = getLocale({ locale });
  }

  getLocale() {
    return this.locale;
  }
}
