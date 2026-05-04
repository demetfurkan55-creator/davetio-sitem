/**
 * Ana vitrin sabit fiyatları — şablonun birincil `filterId` değerine göre.
 * Almanya (DE): çoklu/düğün segmenti 29 €, tekli 25 € — diğer ülkeler: 999 / 500 TL
 */
export type GeoCurrency = "EUR" | "TRY";

const PREMIUM_TEMPLATE_FILTERS = new Set(["wedding", "wedding_nikah"]);

/** Şablon vitrin satırı — tek para birimi etiketi */
export function vitrinePriceLabel(filterId: string, currency: GeoCurrency): string {
  const premium = PREMIUM_TEMPLATE_FILTERS.has(filterId);
  if (currency === "EUR") {
    return premium ? "29 €" : "25 €";
  }
  return premium ? "999 TL" : "500 TL";
}

/** Katalog sayfası `filter` alanı → vitrine `filterId` */
export function catalogLocaleFilterToVitrineId(
  filter: "dugun" | "nikah" | "kina" | "nisan",
): string {
  const m = { dugun: "wedding", nikah: "nikah", kina: "henna", nisan: "engagement" } as const;
  return m[filter];
}

const PREMIUM_PACKAGE_IDS = new Set(["pkg_solo_wedding", "pkg_wedding_nikah", "pkg_wedding_henna"]);

export function packagePriceLabel(packageId: string, currency: GeoCurrency): string {
  const premium = PREMIUM_PACKAGE_IDS.has(packageId);
  if (currency === "EUR") {
    return premium ? "29 €" : "25 €";
  }
  return premium ? "999 TL" : "500 TL";
}

export function vitrinePricesForTemplateFilter(filterId: string): { tl: string; eur: string } {
  return {
    tl: vitrinePriceLabel(filterId, "TRY"),
    eur: vitrinePriceLabel(filterId, "EUR"),
  };
}
