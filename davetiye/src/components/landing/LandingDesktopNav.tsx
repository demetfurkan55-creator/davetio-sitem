"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import NextLink from "next/link";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export type LandingDesktopNavLabels = {
  howItWorks: string;
  features: string;
  templates: string;
  catalog: string;
  demoInvite: string;
  pricing: string;
  faq: string;
  panel: string;
  more: string;
};

export function LandingDesktopNav({
  labels,
  linkClassName,
}: {
  labels: LandingDesktopNavLabels;
  linkClassName: string;
}) {
  const [moreOpen, setMoreOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const locHash = (hash: string) => `/${locale}${hash.startsWith("#") ? hash : `#${hash}`}`;

  useEffect(() => {
    if (!moreOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setMoreOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMoreOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      window.removeEventListener("keydown", onKey);
    };
  }, [moreOpen]);

  const closeMore = () => setMoreOpen(false);

  const dropItem =
    "block w-full px-4 py-2.5 text-left text-sm font-medium text-ink/85 transition-colors hover:bg-brand-muted/60 hover:text-brand";

  return (
    <nav
      className="hidden items-center justify-center gap-1 lg:flex xl:gap-2"
      aria-label="Primary"
    >
      <a href={locHash("#adimlar")} className={linkClassName}>
        {labels.howItWorks}
      </a>
      <a href={locHash("#deneyim")} className={linkClassName}>
        {labels.features}
      </a>
      <a href={locHash("#sablonlar")} className={linkClassName}>
        {labels.templates}
      </a>
      <Link href="/katalog" className={linkClassName}>
        {labels.catalog}
      </Link>
      <NextLink href="/demo" className={linkClassName}>
        {labels.demoInvite}
      </NextLink>

      <div ref={wrapRef} className="relative">
        <button
          type="button"
          aria-expanded={moreOpen}
          aria-haspopup="menu"
          onClick={() => setMoreOpen((o) => !o)}
          className={cn(
            linkClassName,
            "inline-flex items-center gap-1 font-semibold text-ink/80",
          )}
        >
          {labels.more}
          <ChevronDown
            className={cn(
              "size-3.5 shrink-0 opacity-60 transition-transform duration-200",
              moreOpen && "rotate-180",
            )}
            aria-hidden
          />
        </button>
        {moreOpen ? (
          <div
            className="absolute right-0 top-[calc(100%+0.35rem)] z-[60] min-w-[13.5rem] rounded-2xl border border-ink/[0.08] bg-canvas py-1.5 shadow-[0_20px_50px_-12px_rgba(22,24,20,0.18)] ring-1 ring-ink/[0.04] backdrop-blur-md"
            role="menu"
          >
            <a href={locHash("#fiyatlar")} role="menuitem" className={dropItem} onClick={closeMore}>
              {labels.pricing}
            </a>
            <a href={locHash("#sss")} role="menuitem" className={dropItem} onClick={closeMore}>
              {labels.faq}
            </a>
            <Link href="/panel" role="menuitem" className={dropItem} onClick={closeMore}>
              {labels.panel}
            </Link>
          </div>
        ) : null}
      </div>
    </nav>
  );
}
