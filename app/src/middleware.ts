import createMiddleware from "next-intl/middleware";

import { locales, localePrefix } from "@/utils/navigation";

export default createMiddleware({
  locales,
  localePrefix,
  defaultLocale: "ua"
});

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(ru|ua)/:path*"]
};
