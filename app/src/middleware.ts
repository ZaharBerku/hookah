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
  // Match only internationalized pathnames
  matcher: ["/", "/(ru|uk)/:path*"]
};
