import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Ülke kodu (ISO 3166-1 alpha-2). Önce edge header, yoksa ipapi.co.
 */
export async function GET() {
  const h = await headers();
  let country =
    h.get("x-vercel-ip-country") ?? h.get("cf-ipcountry") ?? h.get("x-country-code") ?? "";
  country = country.trim().toUpperCase();

  if (!/^[A-Z]{2}$/.test(country)) {
    try {
      const res = await fetch("https://ipapi.co/json/", {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      if (res.ok) {
        const j = (await res.json()) as { country_code?: string; error?: boolean };
        if (!j.error && j.country_code) {
          country = j.country_code.trim().toUpperCase();
        }
      }
    } catch {
      /* yoksay */
    }
  }

  if (!/^[A-Z]{2}$/.test(country)) {
    country = "TR";
  }

  return NextResponse.json({ country, countryCode: country });
}
