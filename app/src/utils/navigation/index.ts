import { createLocalizedPathnamesNavigation } from "next-intl/navigation";
import { Pathnames, LocalePrefix } from "next-intl/routing";

export const defaultLocale = "uk" as const;
export const locales = ["uk", "ru"] as const;

export const pathnames: Pathnames<typeof locales> = {
  "/": "/",
  "/pathnames": {
    uk: "/pathnames",
    ru: "/pfadnamen"
  }
};

export const localePrefix: LocalePrefix<typeof locales> = "always";

export const { Link, getPathname, redirect, usePathname, useRouter } =
  createLocalizedPathnamesNavigation({
    locales,
    pathnames,
    localePrefix
  });
