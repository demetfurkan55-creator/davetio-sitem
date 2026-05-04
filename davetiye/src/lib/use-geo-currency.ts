"use client";

import { useEffect, useState } from "react";
import type { GeoCurrency } from "@/lib/vitrine-prices";

/**
 * DE → EUR gösterimi; aksi halde TL.
 * Önce `/api/geo` (Vercel ülke başlığı), gerekirse ipapi.co yedeği.
 */
export function useGeoCurrency(): { currency: GeoCurrency; resolved: boolean } {
  const [currency, setCurrency] = useState<GeoCurrency>("TRY");
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        const res = await fetch("/api/geo", { cache: "no-store" });
        if (!res.ok) throw new Error("geo api");
        const data = (await res.json()) as { country?: string; countryCode?: string | null };
        const cc = String(data.countryCode ?? data.country ?? "TR")
          .trim()
          .toUpperCase();
        if (!cancelled) {
          setCurrency(cc === "DE" ? "EUR" : "TRY");
          setResolved(true);
        }
      } catch {
        if (!cancelled) {
          setCurrency("TRY");
          setResolved(true);
        }
      }
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  return { currency, resolved };
}
