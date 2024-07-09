import createMiddleware from "next-intl/middleware";

import {
  locales,
  localePrefix,
  defaultLocale,
  pathnames
} from "@/utils/navigation";

export default createMiddleware({
  defaultLocale,
  locales,
  localePrefix,
  pathnames
});
export const config = {
  matcher: ["/", "/(uk|ru)/:path*", "/((?!_next|_vercel|.*\\..*).*)"]
};
