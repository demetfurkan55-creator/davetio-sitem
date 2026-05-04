"use client";

import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { DavetioMark } from "@/components/branding/DavetioMark";
import { DavetiyeTemplateCard } from "@/components/davetio/DavetiyeTemplateCard";
import { AmbientPhotoBackdrop } from "@/components/ui/AmbientPhotoBackdrop";
import { SITE_AMBIENT } from "@/lib/site-ambient";
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
  priceStrike: string;
  priceCurrent: string;
};

export function DavetioCatalogHome() {
  const t = useTranslations("Catalog");
  const products = t.raw("products") as CatalogProduct[];
  const [active, setActive] = useState<FilterId>("all");

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
    <div className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-canvas text-ink">
      <AmbientPhotoBackdrop
        src={SITE_AMBIENT.gardenArches}
        overlayClassName="bg-gradient-to-b from-canvas/90 via-canvas/78 to-canvas/94"
      />
      <header className="sticky top-0 z-40 border-b border-ink/[0.06] bg-canvas/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="group flex items-center gap-2.5">
            <DavetioMark size={36} variant="romantic" className="transition-transform duration-300 group-hover:rotate-[-4deg]" />
            <span className="font-display text-lg font-semibold tracking-tight sm:text-xl">
              {t("brand")}
              <span className="text-seal-gold">.</span>
            </span>
          </Link>
          <LocaleSwitcher />
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mb-10 text-center sm:text-left">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-muted sm:text-xs">{t("tagline")}</p>
          <h1 className="mt-2 font-display text-[1.65rem] font-semibold leading-tight text-ink sm:text-3xl lg:text-[2.1rem]">
            {t("headline")}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:mx-0 sm:text-base">
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
                  "rounded-full border px-4 py-2.5 text-xs font-bold uppercase tracking-[0.12em] transition-all duration-200 sm:text-[0.7rem]",
                  isActive
                    ? "border-ink bg-ink text-white shadow-md"
                    : "border-ink/12 bg-white text-muted shadow-sm hover:border-ink/22 hover:text-ink",
                )}
              >
                {t(labelKey)}
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted">{t("emptyCategory")}</p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((p) => (
              <DavetiyeTemplateCard
                key={p.slug}
                slug={p.slug}
                imageAlt={p.imageAlt}
                title={p.name}
                tagBadge={t(p.badge === "popular" ? "badgePopular" : "badgeNew")}
                categoryBadge={p.label}
                priceStrike={p.priceStrike}
                priceCurrent={p.priceCurrent}
                ctaLabel={t("viewProduct")}
              />
            ))}
          </div>
        )}

        <p className="mt-14 text-center text-xs text-muted sm:text-left">{t("footerNote", { year: new Date().getFullYear() })}</p>
      </main>
    </div>
  );
}
