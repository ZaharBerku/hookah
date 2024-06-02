import {locales} from "@/utils/navigation";

const getLocale = (params: { locale: "uk" | "ru" }) => {
  console.log(params.locale, 'locales')
  return locales.includes(params.locale) ? params.locale : "uk"
}

export { getLocale }