import createMiddleware from "next-intl/middleware";
import { routing } from "@repo/shared/i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Skip Next internals and files with an extension.
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
