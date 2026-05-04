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
  onPreview?: () => void;
  previewLabel?: string;
  className?: string;
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
  onPreview,
  previewLabel,
  className,
}: DavetiyeTemplateCardProps) {
  const src = resolveTemplateHeroImage(slug, coverImage);

  return (
    <article
      className={cn(
        "group flex flex-col rounded-2xl border border-ink/[0.06] bg-white p-3 shadow-[0_8px_40px_rgba(22,24,20,0.06)]",
        "transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(22,24,20,0.1)]",
        className,
      )}
    >
      <div
        className="relative aspect-square overflow-hidden rounded-xl bg-canvas-muted ring-1 ring-ink/[0.05]"
        role="img"
        aria-label={imageAlt}
      >
        <Image
          src={src}
          alt={imageAlt}
          fill
          sizes="(max-width: 640px) 50vw, 33vw"
          className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
        <span className="absolute left-2.5 top-2.5 z-[1] rounded-md bg-sage-deep px-2 py-1 text-[0.62rem] font-bold uppercase tracking-[0.12em] text-white shadow-sm sm:text-[0.65rem]">
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
            className="flex w-full items-center justify-center rounded-xl border border-ink/12 bg-white py-2.5 text-sm font-semibold text-ink transition-colors duration-200 hover:border-accent-rose/35 hover:bg-accent-rose-muted/50 hover:text-accent-rose-hover"
          >
            {ctaLabel}
          </Link>
        </div>
      </div>
    </article>
  );
}
