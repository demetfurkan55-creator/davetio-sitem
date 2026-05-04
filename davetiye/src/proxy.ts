import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { shouldRewriteRootToInvite } from "./lib/public-invitation";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

/** next-intl — tarayıcı dil tercihi yerine coğrafi tespit ile senkron */
const LOCALE_COOKIE = "NEXT_LOCALE";

const COOKIE_OPTS = {
  path: "/",
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24 * 365,
};

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

/**
 * Türkiye → tr; diğer tüm ülkeler → de.
 * Ülke okunamıyorsa (localhost vb.) tr — geliştirme ve varsayılan iç pazar.
 */
function localeFromCountry(country: string): "tr" | "de" {
  if (country === "TR") return "tr";
  if (country === "") return "tr";
  return "de";
}

function isSiteRoot(pathname: string): boolean {
  if (pathname === "/" || pathname === "") return true;
  const normalized = pathname.replace(/\/+$/, "");
  return normalized === "";
}

function pathLocale(pathname: string): "tr" | "de" | null {
  const m = pathname.match(/^\/(tr|de)(?=\/|$)/);
  if (!m?.[1]) return null;
  return m[1] as "tr" | "de";
}

function withLocaleCookie(
  response: NextResponse,
  locale: "tr" | "de",
): NextResponse {
  response.cookies.set(LOCALE_COOKIE, locale, COOKIE_OPTS);
  return response;
}

/** Next.js 16+: `middleware.ts` yerine `proxy.ts` */
export default function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const country = getCountry(request);
  const geoLocale = localeFromCountry(country);
  const search = request.nextUrl.search;

  if (pathname === "/demo" || pathname === "/demo/") {
    const target = new URL(`/${geoLocale}/olustur${search}`, request.url);
    return withLocaleCookie(NextResponse.redirect(target), geoLocale);
  }

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_vercel")
  ) {
    return NextResponse.next();
  }

  /** Kök `/{çift-slug}` → `/invite/{slug}` (URL çubuğu aynı kalır) — dil öneki yok */
  const inviteRootSlug = shouldRewriteRootToInvite(pathname);
  if (inviteRootSlug) {
    return NextResponse.rewrite(
      new URL(`/invite/${inviteRootSlug}${search}`, request.url),
    );
  }

  /** Herkese açık davetiye sayfası — next-intl yönlendirmesine takılmaz */
  if (pathname === "/invite" || pathname.startsWith("/invite/")) {
    return NextResponse.next();
  }

  if (isSiteRoot(pathname)) {
    const target = new URL(`/${geoLocale}${search}`, request.url);
    return withLocaleCookie(NextResponse.redirect(target), geoLocale);
  }

  const currentLocale = pathLocale(pathname);
  if (currentLocale && currentLocale !== geoLocale) {
    const newPath = pathname.replace(/^\/(tr|de)/, `/${geoLocale}`) + search;
    const target = new URL(newPath, request.url);
    return withLocaleCookie(NextResponse.redirect(target), geoLocale);
  }

  const res = intlMiddleware(request);
  return withLocaleCookie(res, geoLocale);
}

export const config = {
  matcher: [
    "/",
    "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
  ],
};
