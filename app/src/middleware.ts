import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["ru", "uk"],

  defaultLocale: "uk"
});

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(ru|uk)/:path*"]
};
