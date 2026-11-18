const DEFAULT_BASE_URL = "https://hookahstore.com.ua";
const LOCALES = ["uk", "ru"] as const;
const DEFAULT_LOCALE = "uk";

type Locale = (typeof LOCALES)[number];

const baseUrl = () =>
  (process.env.NEXT_PUBLIC_BASE_URL || DEFAULT_BASE_URL).replace(/\/+$/, "");

const localeUrl = (locale: Locale, path: string) =>
  path ? `${baseUrl()}/${locale}/${path}` : `${baseUrl()}/${locale}`;

export const buildAlternates = (locale: string, path: string) => {
  const current = LOCALES.includes(locale as Locale)
    ? (locale as Locale)
    : DEFAULT_LOCALE;
  const cleanPath = path.replace(/^\/+|\/+$/g, "");
  return {
    canonical: localeUrl(current, cleanPath),
    languages: {
      uk: localeUrl("uk", cleanPath),
      ru: localeUrl("ru", cleanPath),
      "x-default": localeUrl(DEFAULT_LOCALE, cleanPath)
    }
  };
};
