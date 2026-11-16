import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

export const defaultLocale = "uk" as const;
export const locales = ["uk", "ru"] as const;

const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always",
  localeCookie: { maxAge: ONE_YEAR_IN_SECONDS }
});

export const { Link, getPathname, redirect, usePathname, useRouter } =
  createNavigation(routing);
