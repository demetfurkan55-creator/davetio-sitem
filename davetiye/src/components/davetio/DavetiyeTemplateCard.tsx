"use client";

import Image from "next/image";
import { Eye } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { resolveTemplateHeroImage } from "@/lib/template-preview-images";

const ART_GRADIENTS: Record<string, string> = {
  "serenade-hall":
    "linear-gradient(165deg, #fdf6f4 0%, #f3e6e2 38%, #ead5cf 100%)",
  "meadow-vows":
    "linear-gradient(165deg, #faf8f4 0%, #e8ebe4 45%, #dce3d8 100%)",
  "civic-bloom":
    "linear-gradient(165deg, #ffffff 0%, #f2eef0 40%, #e8dfe4 100%)",
  "ivory-union":
    "linear-gradient(165deg, #fffdfb 0%, #f5efe9 45%, #ebe3dc 100%)",
  "rose-script":
    "linear-gradient(165deg, #fdf5f8 0%, #ecd9e4 42%, #dfc9d6 100%)",
  "pearl-mist":
    "linear-gradient(165deg, #f8fafc 0%, #e6eaf2 48%, #dde4ef 100%)",
  "golden-hour":
    "linear-gradient(165deg, #fff9f5 0%, #f5e6dc 40%, #e8cfc0 100%)",
  "marble-vow":
    "linear-gradient(165deg, #fafafa 0%, #ebe8e8 45%, #ddd9d9 100%)",
};

function artGradientForSlug(slug: string) {
  return ART_GRADIENTS[slug] ?? "linear-gradient(165deg, #fdf9f9 0%, #f0e8e4 50%, #e8dfd9 100%)";
}

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
  /** Kurumsal fiyat yerine tek satır — örn. Premium koleksiyon */
  priceLine?: string;
  onPreview?: () => void;
  previewLabel?: string;
  className?: string;
  /** Altın çerçeve ve kağıt gölgesi */
  luxury?: boolean;
  /** Gerçek davetiye önizlemesi — kurumsal alt alan gizlenir */
  gallery?: boolean;
  /** Dış görsel yok — saf tipografi ve suluboya degrade */
  invitationArt?: boolean;
  showPrice?: boolean;
  /** Ana vitrin — TL kalın bordo, EUR yanında ince */
  priceTl?: string;
  priceEur?: string;
  /** Geo ile tek para birimi — çift kur gösterme */
  priceBelowCard?: string;
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
  priceLine,
  onPreview,
  previewLabel,
  className,
  luxury,
  gallery = false,
  invitationArt = false,
  showPrice = false,
  priceTl,
  priceEur,
  priceBelowCard,
}: DavetiyeTemplateCardProps) {
  const src = resolveTemplateHeroImage(slug, coverImage);
  const couple = cardCouple?.trim() || title;
  const dateLine = cardDate?.trim() || "—";
  const eyebrow = cardEyebrow?.trim();
  const maroonLine = priceLine?.trim() || priceCurrent;
  const singleBelow = priceBelowCard?.trim();

  if (invitationArt) {
    const showDualPrice = Boolean(priceTl?.trim() && priceEur?.trim()) && !singleBelow;

    return (
      <article
        className={cn(
          "group flex flex-col transition duration-500 ease-out hover:-translate-y-1",
          luxury &&
            "rounded-[1.75rem] border border-[#c9a44a]/32 bg-white/40 p-1.5 shadow-[0_28px_72px_-34px_rgba(201,164,74,0.42),0_14px_42px_-28px_rgba(74,20,32,0.12)] hover:shadow-[0_36px_88px_-32px_rgba(201,164,74,0.48),0_20px_52px_-26px_rgba(74,20,32,0.16)]",
          className,
        )}
      >
        <Link
          href={`/templates/${slug}`}
          className="relative block overflow-hidden rounded-[1.45rem] ring-1 ring-[#c9a44a]/22"
          aria-label={imageAlt}
        >
          <div className="relative aspect-[3/4] w-full sm:aspect-[10/13]">
            <div className="absolute inset-0" style={{ background: artGradientForSlug(slug) }} aria-hidden />
            <div
              className="davetio-watercolor-wash pointer-events-none absolute inset-0 opacity-[0.85]"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.35]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E")`,
              }}
              aria-hidden
            />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c9a44a]/45 to-transparent" aria-hidden />
            <span className="absolute left-3 top-3 z-[2] max-w-[calc(100%-1.5rem)] truncate rounded-full border border-[#6b1d2e]/14 bg-white/55 px-3 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-[#6b1d2e]/90 backdrop-blur-[3px] [&:lang(tr)]:tracking-[0.16em]">
              {categoryBadge}
            </span>
            <div className="relative flex h-full flex-col items-center justify-center px-5 pb-10 pt-14 text-center">
              {eyebrow ? (
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-[#6b1d2e]/75">
                  {eyebrow}
                </p>
              ) : null}
              <p className="font-accent mt-5 line-clamp-3 text-[clamp(1.35rem,4.5vw,2rem)] italic leading-[1.15] text-[#4a1420]">
                {couple}
              </p>
              <p className="mt-5 font-display text-sm font-medium tracking-[0.08em] text-[#6b1d2e] sm:text-base">
                {dateLine}
              </p>
              <div className="mt-8 h-px w-16 bg-gradient-to-r from-transparent via-[#c9a44a]/55 to-transparent" aria-hidden />
              {!showDualPrice && !singleBelow ? (
                <p className="mt-6 text-[0.68rem] font-semibold tracking-wide text-[#6b1d2e]">{maroonLine}</p>
              ) : null}
            </div>
          </div>
        </Link>
        {singleBelow ? (
          <div className="mt-4 flex min-h-[1.75rem] items-center justify-center px-1">
            <span className="text-[0.95rem] font-semibold tracking-[0.06em] text-[#6b1d2e]">{singleBelow}</span>
          </div>
        ) : showDualPrice ? (
          <div className="mt-4 flex min-h-[1.5rem] items-baseline justify-center gap-2 px-1">
            <span className="text-lg font-bold tracking-tight text-[#6b1d2e]">{priceTl}</span>
            <span className="text-sm font-light tracking-wide text-[#5e5658]/95">{priceEur}</span>
          </div>
        ) : null}
        <div className={cn("mt-3", !showDualPrice && !singleBelow && "mt-4")}>
          <Link
            href={`/templates/${slug}`}
            className="flex w-full items-center justify-center rounded-2xl border border-[#dfc896]/70 bg-gradient-to-b from-[#fdf6e8] via-[#f0d9a6] to-[#d4b060] py-3 text-center text-xs font-semibold tracking-wide text-[#2f0c12] shadow-[0_14px_36px_-16px_rgba(140,100,40,0.45)] ring-1 ring-white/60 transition hover:brightness-[1.02] sm:text-sm"
          >
            {ctaLabel}
          </Link>
        </div>
        <span className="sr-only">{tagBadge}</span>
      </article>
    );
  }

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
          singleBelow ? (
            <p className="mt-3 text-center text-[0.95rem] font-semibold tabular-nums text-[#6b1d2e]">{singleBelow}</p>
          ) : (
            <p className="mt-3 text-center text-[0.65rem] font-medium text-[#6b1d2e]/70">
              <span className="line-through opacity-50">{priceStrike}</span>{" "}
              <span className="text-[#6b1d2e]">{priceCurrent}</span>
            </p>
          )
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
