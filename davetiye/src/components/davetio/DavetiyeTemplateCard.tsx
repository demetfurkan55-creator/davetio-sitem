"use client";

import Image from "next/image";
import { Eye } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { resolveTemplateHeroImage } from "@/lib/template-preview-images";

export type DavetiyeTemplateCardProps = {
  slug: string;
  imageAlt: string;
  /** Yerel `/images/...` veya uzaktan URL; yoksa şablona göre varsayılan görsel */
  coverImage?: string;
  title: string;
  tagBadge: string;
  categoryBadge: string;
  priceStrike: string;
  priceCurrent: string;
  ctaLabel: string;
  /** Vitrin davetiye görünümü — çift ve tarih */
  cardEyebrow?: string;
  cardCouple?: string;
  cardDate?: string;
  onPreview?: () => void;
  previewLabel?: string;
  className?: string;
  /** Altın çerçeve ve kağıt gölgesi */
  luxury?: boolean;
  /** Gerçek davetiye önizlemesi — kurumsal alt alan gizlenir */
  gallery?: boolean;
  showPrice?: boolean;
};

export function DavetiyeTemplateCard({
  slug,
  imageAlt,
  coverImage,
  title,
  tagBadge,
  categoryBadge,
  priceStrike,
  priceCurrent,
  ctaLabel,
  cardEyebrow,
  cardCouple,
  cardDate,
  onPreview,
  previewLabel,
  className,
  luxury,
  gallery = false,
  showPrice = false,
}: DavetiyeTemplateCardProps) {
  const src = resolveTemplateHeroImage(slug, coverImage);
  const couple = cardCouple?.trim() || title;
  const dateLine = cardDate?.trim() || "—";
  const eyebrow = cardEyebrow?.trim();

  if (gallery) {
    return (
      <article
        className={cn(
          "group flex flex-col",
          luxury &&
            "rounded-[1.75rem] border border-[#c9a44a]/25 bg-white/40 p-1.5 shadow-[0_24px_60px_-32px_rgba(60,20,30,0.15),0_0_0_1px_rgba(107,29,46,0.04)] transition duration-500 ease-out hover:-translate-y-1.5 hover:shadow-[0_32px_70px_-28px_rgba(60,20,30,0.2),0_0_0_1px_rgba(201,164,74,0.2)]",
          className,
        )}
      >
        <div
          className={cn(
            "relative w-full overflow-hidden rounded-[1.5rem] ring-1 ring-[#6b1d2e]/[0.07]",
            luxury && "rounded-[1.4rem] ring-[#c9a44a]/20",
          )}
        >
          <div className="relative aspect-[3/4] w-full sm:aspect-[3.5/4.5]">
            <Image
              src={src}
              alt={imageAlt}
              fill
              sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
              className="object-cover object-center transition duration-700 ease-out group-hover:scale-[1.04]"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-[#1a0a0d]/88 via-[#1a0a0d]/25 to-transparent"
              aria-hidden
            />
            {onPreview ? (
              <button
                type="button"
                onClick={onPreview}
                aria-label={previewLabel ?? "Önizle"}
                title={previewLabel}
                className="absolute right-3 top-3 z-[2] flex size-9 items-center justify-center rounded-full border border-white/25 bg-white/12 text-white shadow-lg backdrop-blur-sm transition hover:scale-105 active:scale-95"
              >
                <Eye className="size-4" aria-hidden />
              </button>
            ) : null}
            <div className="absolute inset-x-0 bottom-0 z-[1] flex flex-col items-center px-4 pb-6 pt-12 text-center text-white">
              {eyebrow ? (
                <p className="text-[0.6rem] font-semibold uppercase tracking-[0.28em] text-[#e8d5a6] opacity-95">
                  {eyebrow}
                </p>
              ) : null}
              <p className="font-accent mt-2 line-clamp-2 text-[clamp(1.5rem,4.2vw,2.1rem)] leading-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)]">
                {couple}
              </p>
              <p className="mt-2 font-display text-sm font-medium tracking-wide text-white/90 sm:text-base">
                {dateLine}
              </p>
            </div>
          </div>
        </div>
        {showPrice ? (
          <p className="mt-3 text-center text-[0.65rem] font-medium text-[#6b1d2e]/70">
            <span className="line-through opacity-50">{priceStrike}</span>{" "}
            <span className="text-[#6b1d2e]">{priceCurrent}</span>
          </p>
        ) : null}
        <div className="mt-4">
          <Link
            href={`/templates/${slug}`}
            className="flex w-full items-center justify-center border border-[#6b1d2e]/12 bg-white/60 py-2.5 text-center text-xs font-semibold text-[#4a1420] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] transition hover:border-[#c9a44a]/35 hover:bg-white/90 sm:text-sm"
          >
            {ctaLabel}
          </Link>
        </div>
      </article>
    );
  }

  return (
    <article
      className={cn(
        "group flex flex-col rounded-2xl border border-ink/[0.06] bg-white p-3 shadow-[0_8px_40px_rgba(22,24,20,0.06)]",
        "transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(22,24,20,0.1)]",
        luxury &&
          "rounded-[2rem] border-seal-gold/22 bg-gradient-to-b from-white via-white to-canvas/90 p-3.5 shadow-[0_24px_70px_-28px_rgba(20,31,56,0.14),0_8px_24px_rgba(198,160,74,0.08)] hover:-translate-y-[6px] hover:shadow-[0_32px_80px_-26px_rgba(20,31,56,0.16),0_12px_32px_rgba(198,160,74,0.12)]",
        className,
      )}
    >
      <div
        className={cn(
          "relative aspect-square overflow-hidden rounded-xl bg-canvas-muted ring-1 ring-ink/[0.05]",
          luxury && "rounded-[1.35rem] ring-seal-gold/18",
        )}
        role="img"
        aria-label={imageAlt}
      >
        <Image
          src={src}
          alt={imageAlt}
          fill
          sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
          className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
        <span
          className={cn(
            "absolute left-2.5 top-2.5 z-[1] rounded-md px-2 py-1 text-[0.62rem] font-bold uppercase tracking-[0.12em] text-white shadow-sm sm:text-[0.65rem]",
            luxury ? "bg-[#6b1d2e]" : "bg-sage-deep",
          )}
        >
          {tagBadge}
        </span>
        <span className="absolute right-2.5 top-2.5 z-[1] rounded-md border border-ink/10 bg-white/95 px-2 py-1 text-[0.62rem] font-bold uppercase tracking-[0.1em] text-ink/85 shadow-sm backdrop-blur-[2px] sm:text-[0.65rem]">
          {categoryBadge}
        </span>
        {onPreview ? (
          <button
            type="button"
            onClick={onPreview}
            aria-label={previewLabel ?? "Önizle"}
            title={previewLabel}
            className="absolute bottom-2.5 right-2.5 z-[1] flex size-9 items-center justify-center rounded-full border border-ink/10 bg-white/95 text-brand shadow-md backdrop-blur-[2px] transition-transform hover:scale-105 active:scale-95 sm:bottom-3 sm:right-3 sm:size-10"
          >
            <Eye className="size-4 sm:size-[1.15rem]" aria-hidden />
          </button>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col px-1 pb-1 pt-3.5">
        <h3 className="text-center font-display text-[0.98rem] font-semibold leading-snug text-ink sm:text-[1.06rem]">
          {title}
        </h3>
        <div className="mt-2.5 flex flex-wrap items-baseline justify-center gap-2">
          <span className="text-sm text-muted line-through">{priceStrike}</span>
          <span className="text-lg font-bold tracking-tight text-accent-rose sm:text-xl">
            {priceCurrent}
          </span>
        </div>
        <div className="mt-auto pt-3.5">
          <Link
            href={`/templates/${slug}`}
            className={cn(
              "flex w-full items-center justify-center border border-ink/12 bg-white py-2.5 text-sm font-semibold text-ink transition-colors duration-200 hover:border-accent-rose/35 hover:bg-accent-rose-muted/50 hover:text-accent-rose-hover",
              luxury ? "rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]" : "rounded-xl",
            )}
          >
            {ctaLabel}
          </Link>
        </div>
      </div>
    </article>
  );
}
