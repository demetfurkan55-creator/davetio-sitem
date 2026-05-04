import { SITE_AMBIENT } from "@/lib/site-ambient";

/**
 * Şablon detayı, vitrin önizlemesi ve video poster için portre uyumlu görseller.
 * Mesaj dosyalarındaki yerel `/images/...` yolları yerine çözülür.
 */
export const TEMPLATE_HERO_BY_SLUG: Record<string, string> = {
  "serenade-hall": SITE_AMBIENT.venueWarm,
  "meadow-vows": SITE_AMBIENT.gardenArches,
  /** Nikah / resmî ton — zarif masa ve çiçek */
  "civic-bloom":
    "https://images.unsplash.com/photo-1469371670804-317a34292257?w=900&q=78&auto=format&fit=crop",
  /** Fildişi minimal iç mekân */
  "ivory-union":
    "https://images.unsplash.com/photo-1522673607200-164f1ce118d8?w=900&q=78&auto=format&fit=crop",
  /** Gümüş gece — yumuşak koyu ambiyans */
  "rose-script": SITE_AMBIENT.darkVelvet,
  "pearl-mist": SITE_AMBIENT.ringsSoft,
  "golden-hour": SITE_AMBIENT.toastAmbient,
  /** Mermer doku */
  "marble-vow":
    "https://images.unsplash.com/photo-1615876234886-f313e9ad42ec?w=900&q=78&auto=format&fit=crop",
};

export function resolveTemplateHeroImage(slug: string, imageFromMessages?: string): string {
  if (imageFromMessages?.startsWith("http")) return imageFromMessages;
  return TEMPLATE_HERO_BY_SLUG[slug] ?? SITE_AMBIENT.heroBloom;
}
