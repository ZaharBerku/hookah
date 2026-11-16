import createMiddleware from "next-intl/middleware";

import { routing } from "@/utils/navigation";

export default createMiddleware(routing);

export const config = {
  matcher: ["/", "/(ru|uk)/:path*"]
};
