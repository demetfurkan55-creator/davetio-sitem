"use client";

import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { AmbientPhotoBackdrop } from "@/components/ui/AmbientPhotoBackdrop";
import { SITE_AMBIENT } from "@/lib/site-ambient";
import { cn } from "@/lib/utils";

type FaqItem = { q: string; a: string };

export function FaqSection({ items }: { items: FaqItem[] }) {
  const t = useTranslations("FAQ");
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="sss"
      className="relative scroll-mt-28 overflow-hidden border-t border-ink/[0.06] bg-[linear-gradient(180deg,_#f5f3fa_0%,_#ebe7f4_100%)] py-16 sm:py-20 lg:scroll-mt-24"
    >
      <AmbientPhotoBackdrop
        src={SITE_AMBIENT.softBotanical}
        overlayClassName="bg-gradient-to-b from-[#f5f3fa]/92 via-[#ebe7f4]/82 to-[#ebe7f4]/94"
      />
      <div className="relative z-10 mx-auto max-w-2xl px-5 sm:px-8">
        <p className="text-center text-[0.65rem] font-bold uppercase tracking-[0.22em] text-brand">
          {t("tag")}
        </p>
        <h2 className="mt-2 text-center font-display text-3xl font-bold tracking-tight text-ink sm:text-[2.15rem]">
          {t("title")}
        </h2>
        <ul className="mt-10 space-y-3">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <li key={item.q}>
                <div
                  className={cn(
                    "overflow-hidden rounded-2xl border bg-white/95 shadow-sm backdrop-blur-sm transition-all duration-300",
                    isOpen
                      ? "border-brand/40 shadow-[var(--shadow-card-hover)] ring-1 ring-brand/15"
                      : "border-ink/[0.07] hover:border-brand/25 hover:shadow-md",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm font-semibold leading-snug text-ink sm:text-[0.95rem]">
                      {item.q}
                    </span>
                    <ChevronDown
                      className={cn(
                        "mt-0.5 size-5 shrink-0 text-brand transition-transform duration-300",
                        isOpen && "rotate-180",
                      )}
                      aria-hidden
                    />
                  </button>
                  {isOpen ? (
                    <p className="border-t border-black/[0.06] px-5 pb-5 pt-3 text-sm leading-relaxed text-muted sm:px-6">
                      {item.a}
                    </p>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
