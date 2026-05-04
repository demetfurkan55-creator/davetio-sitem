"use client";

import { useMemo, useState } from "react";
import { DavetiyeTemplateCard } from "@/components/davetio/DavetiyeTemplateCard";
import { LandingLuxuryHero } from "@/components/landing/LandingLuxuryHero";
import { useGeoCurrency } from "@/lib/use-geo-currency";
import { vitrinePriceLabel } from "@/lib/vitrine-prices";

export type LandingShowcaseItem = {
  slug: string;
  filterId: string;
  matchTags?: string[];
  name: string;
  category: string;
  tag: string;
  image: string;
  imageAlt: string;
  cardEyebrow: string;
  cardCouple: string;
  cardDate: string;
  priceStrike: string;
  priceCurrent: string;
  priceLine?: string;
};

type ShowcaseCategory = { id: string; label: string };

export function LandingShowcaseCatalog({
  items,
  categories,
  gridEyebrow,
  ctaCreate,
  emptyCategory,
  filterAria,
}: {
  items: LandingShowcaseItem[];
  categories: ShowcaseCategory[];
  gridEyebrow: string;
  ctaCreate: string;
  emptyCategory: string;
  filterAria: string;
}) {
  const [active, setActive] = useState("all");
  const { currency } = useGeoCurrency();

  const filtered = useMemo(() => {
    if (active === "all") return items;
    return items.filter((it) => {
      const tags = it.matchTags ?? [it.filterId];
      return tags.includes(active);
    });
  }, [active, items]);

  return (
    <section className="w-full">
      <LandingLuxuryHero
        categories={categories}
        active={active}
        onCategoryChange={setActive}
        filterAria={filterAria}
      />

      <div className="mx-auto max-w-[88rem] px-[max(1rem,env(safe-area-inset-left,0px))] pb-3 pt-2 pr-[max(1rem,env(safe-area-inset-right,0px))] sm:px-10">
        <p className="text-center font-display text-[clamp(0.95rem,2vw,1.15rem)] font-medium tracking-[0.06em] text-[#6b1d2e]/75">
          {gridEyebrow}
        </p>
      </div>

      <div className="mx-auto max-w-[88rem] px-[max(1rem,env(safe-area-inset-left,0px))] pb-24 pt-2 pr-[max(1rem,env(safe-area-inset-right,0px))] sm:px-10 sm:pb-32">
        {filtered.length === 0 ? (
          <p className="py-16 text-center text-sm text-[#5e5658]">{emptyCategory}</p>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-7 lg:grid-cols-3 lg:gap-8 xl:grid-cols-4">
            {filtered.map((it) => {
              const priceBelow = vitrinePriceLabel(it.filterId, currency);
              return (
                <DavetiyeTemplateCard
                  key={it.slug}
                  slug={it.slug}
                  imageAlt={it.imageAlt}
                  title={it.name}
                  tagBadge={it.tag}
                  categoryBadge={it.category}
                  priceStrike={it.priceStrike}
                  priceCurrent={it.priceCurrent}
                  cardEyebrow={it.cardEyebrow}
                  cardCouple={it.cardCouple}
                  cardDate={it.cardDate}
                  ctaLabel={ctaCreate}
                  invitationArt
                  luxury
                  priceBelowCard={priceBelow}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
