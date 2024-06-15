import {locales} from "@/utils/navigation";

const getLocale = (params: { locale: "uk" | "ru" }) => {
  return locales.includes(params.locale) ? params.locale : "uk"
}

export { getLocale }
