"use client";

import { useTranslations } from "next-intl";
import { ScrollText } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "@/i18n/navigation";
import { DavetiyeTemplateCard } from "@/components/davetio/DavetiyeTemplateCard";
import { useGeoCurrency } from "@/lib/use-geo-currency";
import { catalogLocaleFilterToVitrineId, vitrinePriceLabel } from "@/lib/vitrine-prices";
import { cn } from "@/lib/utils";

const FILTER_IDS = ["all", "dugun", "nikah", "kina", "nisan"] as const;

type FilterId = (typeof FILTER_IDS)[number];

type CatalogProduct = {
  slug: string;
  filter: Exclude<FilterId, "all">;
  name: string;
  badge: "popular" | "new";
  label: string;
  imageAlt: string;
  cardEyebrow?: string;
  cardCouple?: string;
  cardDate?: string;
  priceStrike: string;
  priceCurrent: string;
  priceLine?: string;
};

export function DavetioCatalogHome() {
  const t = useTranslations("Catalog");
  const products = t.raw("products") as CatalogProduct[];
  const [active, setActive] = useState<FilterId>("all");
  const { currency } = useGeoCurrency();

  const filtered = useMemo(() => {
    if (active === "all") return products;
    return products.filter((p) => p.filter === active);
  }, [active, products]);

  const filterConfig: {
    id: FilterId;
    labelKey: "catAll" | "catWedding" | "catNikah" | "catHenna" | "catEngagement";
  }[] = [
    { id: "all", labelKey: "catAll" },
    { id: "dugun", labelKey: "catWedding" },
    { id: "nikah", labelKey: "catNikah" },
    { id: "nisan", labelKey: "catEngagement" },
    { id: "kina", labelKey: "catHenna" },
  ];

  return (
    <div className="relative flex min-h-[100dvh] w-full max-w-[100vw] min-w-0 flex-col overflow-x-hidden text-ink">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: "linear-gradient(175deg, #FDF9F9 0%, #F5EFEB 42%, #f0e8e4 100%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.24] mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`,
        }}
        aria-hidden
      />
      <header className="sticky top-0 z-40 border-b border-[#6b1d2e]/[0.08] bg-[#F5EFEB]/88 pt-[env(safe-area-inset-top,0px)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl min-w-0 items-center justify-between gap-3 px-4 py-2.5 sm:gap-4 sm:px-6 sm:py-3 lg:px-8">
          <Link href="/" className="group flex items-center gap-2.5">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[#c9a44a]/45 bg-gradient-to-br from-white/85 to-[#f5efeb]/95 shadow-[0_4px_18px_rgba(74,20,32,0.08)] ring-1 ring-[#c9a44a]/22 transition group-hover:border-[#c9a44a]/60">
              <ScrollText className="size-[1.05rem] text-[#6b1d2e]" strokeWidth={1.35} aria-hidden />
            </span>
            <span className="font-display text-lg font-semibold tracking-tight text-[#4a1420] sm:text-xl">
              {t("brand")}
              <span className="text-[#c9a44a]">.</span>
            </span>
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full min-w-0 max-w-6xl flex-1 overflow-x-hidden px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mb-10 text-center sm:text-left">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.26em] text-[#b8923f] sm:text-xs">{t("tagline")}</p>
          <h1 className="mt-2 font-display text-[1.65rem] font-semibold leading-tight text-[#4a1420] sm:text-3xl lg:text-[2.1rem]">
            {t("headline")}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl font-sans text-sm leading-relaxed text-[#5e5658] sm:mx-0 sm:text-base">
            {t("lead")}
          </p>
        </div>

        <div className="mb-10 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
          {filterConfig.map(({ id, labelKey }) => {
            const isActive = active === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActive(id)}
                className={cn(
                  "rounded-full border px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] transition-all duration-200 sm:text-[0.68rem]",
                  isActive
                    ? "border-[#6b1d2e] bg-[#6b1d2e] text-white shadow-[0_10px_28px_-12px_rgba(107,29,46,0.45)]"
                    : "border-[#6b1d2e]/15 bg-white/70 text-[#5e5658] shadow-sm hover:border-[#c9a44a]/35 hover:text-[#4a1420]",
                )}
              >
                {t(labelKey)}
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <p className="py-16 text-center text-sm text-[#5e5658]">{t("emptyCategory")}</p>
        ) : (
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-12 sm:grid-cols-3 sm:gap-8">
            {filtered.map((p) => {
              const vitrineId = catalogLocaleFilterToVitrineId(p.filter);
              const priceBelow = vitrinePriceLabel(vitrineId, currency);
              return (
                <DavetiyeTemplateCard
                  key={p.slug}
                  slug={p.slug}
                  imageAlt={p.imageAlt}
                  title={p.name}
                  tagBadge={t(p.badge === "popular" ? "badgePopular" : "badgeNew")}
                  categoryBadge={p.label}
                  priceStrike={p.priceStrike}
                  priceCurrent={p.priceCurrent}
                  priceLine={p.priceLine}
                  cardEyebrow={p.cardEyebrow}
                  cardCouple={p.cardCouple}
                  cardDate={p.cardDate}
                  ctaLabel={t("viewProduct")}
                  invitationArt
                  luxury
                  priceBelowCard={priceBelow}
                />
              );
            })}
          </div>
        )}

        <p className="mt-14 text-center text-xs text-[#5e5658] sm:text-left">
          {t("footerNote", { year: new Date().getFullYear() })}
        </p>
      </main>
    </div>
  );
}
