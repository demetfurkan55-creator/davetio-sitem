import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

/** next-intl default cookie name (see routing config.js) */
const LOCALE_COOKIE = "NEXT_LOCALE";

function getCountry(request: NextRequest): string {
  if (process.env.NODE_ENV === "development") {
    const dev = request.headers.get("x-dev-geo-country");
    if (dev?.trim()) return dev.trim().toUpperCase();
  }
  const raw =
    request.headers.get("x-vercel-ip-country") ??
    request.headers.get("cf-ipcountry") ??
    request.headers.get("cloudfront-viewer-country") ??
    request.headers.get("x-country-code") ??
    "";
  return raw.trim().toUpperCase();
}

function isSiteRoot(pathname: string): boolean {
  if (pathname === "/" || pathname === "") return true;
  const normalized = pathname.replace(/\/+$/, "");
  return normalized === "";
}

/** Next.js 16+: `middleware.ts` yerine `proxy.ts` — aksi halde kenar katmanda davranış uyumsuzluğu (CSS/JS kırılması) görülebilir. */
export default function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_vercel")
  ) {
    return NextResponse.next();
  }

  const country = getCountry(request);
  const localeCookie = request.cookies.get(LOCALE_COOKIE)?.value;

  const fromGermany = country === "DE";
  const noLocalePreference = !localeCookie;
  const hitRoot = isSiteRoot(pathname);

  if (fromGermany && noLocalePreference && hitRoot) {
    const res = NextResponse.redirect(new URL("/de", request.url));
    res.cookies.set(LOCALE_COOKIE, "de", {
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
    });
    return res;
  }

  return intlMiddleware(request);
}

/**
 * next-intl önerisi: `/_next` tamamı hariç — yalnızca `_next/static` yazmak Turbopack/Webpack
 * alt yollarında proxy’nin yanlışlıkla çalışmasına izin verebilir ve CSS yanıtını bozar.
 */
export const config = {
  matcher: [
    "/",
    "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
  ],
};
