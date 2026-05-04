"use client";

import { useLocale, useTranslations } from "next-intl";
import { Calendar, Clock, Globe, MapPin, Music, Navigation } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useEffect, useRef, useState } from "react";
import { getTemplatePreviewDemo } from "@/lib/template-preview-demo";
import { cn } from "@/lib/utils";

const featureIcons = [Clock, Music, Globe, Calendar] as const;

export function TemplateDetailClient({
  slug,
  image,
  imageAlt,
  title,
  intro,
  ambientVideoSrc,
}: {
  slug: string;
  image: string;
  imageAlt: string;
  title: string;
  intro: string;
  ambientVideoSrc: string;
}) {
  const locale = useLocale();
  const mapDemo = getTemplatePreviewDemo(slug, locale);
  const t = useTranslations("TemplateDetail");
  const packages = t.raw("packages") as { id: string; label: string }[];
  const features = t.raw("features") as string[];
  const [pkg, setPkg] = useState(packages[0]?.id ?? "solo");
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.loop = true;
    v.playsInline = true;
    const p = v.play();
    if (p) p.catch(() => {});
    return () => {
      v.pause();
    };
  }, [ambientVideoSrc]);

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-5 py-10 sm:px-8 lg:grid-cols-2 lg:items-start lg:gap-14 lg:py-14">
      <div className="order-2 lg:order-1">
        <div className="overflow-hidden rounded-[1.75rem] border border-ink/[0.07] bg-white shadow-[var(--shadow-card)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]">
          <div className="relative aspect-[4/5] max-h-[520px] w-full overflow-hidden bg-zinc-900">
            <video
              ref={videoRef}
              className="absolute inset-0 z-0 h-full w-full scale-[1.01] object-cover object-center [transform:translateZ(0)]"
              src={ambientVideoSrc}
              poster={image}
              muted
              playsInline
              loop
              preload="metadata"
              aria-hidden
            />
            <div className="absolute inset-0 z-[1] flex flex-col justify-end bg-gradient-to-t from-ink/92 via-ink/35 to-transparent p-4 text-center text-white sm:p-6">
              <p className="text-[0.55rem] font-bold uppercase tracking-[0.28em] text-white/85">
                {t("sampleEyebrow")}
              </p>
              <p className="mt-1.5 font-display text-2xl font-bold leading-tight sm:text-3xl">{t("sampleNames")}</p>
              <p className="mt-1.5 text-xs font-medium text-white/90 sm:text-sm">{t("sampleDate")}</p>
              <p className="mt-2 flex items-center justify-center gap-1 text-[0.7rem] text-white/85">
                <MapPin className="size-3.5 shrink-0 text-soft-gold" aria-hidden />
                <span>{t("sampleVenue")}</span>
              </p>
              <div className="mx-auto mt-4 w-full max-w-[280px] overflow-hidden rounded-xl border border-white/25 shadow-lg">
                <div className="relative h-[4.25rem] w-full overflow-hidden sm:h-[4.75rem]">
                  <iframe
                    title=""
                    src={mapDemo.mapEmbedUrl}
                    className="absolute inset-0 h-[120%] w-full -translate-y-[10%] border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
                <a
                  href={mapDemo.mapsOpenUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-white/95 px-2 py-2 text-[0.62rem] font-semibold uppercase tracking-wide text-ink transition hover:bg-white"
                >
                  <Navigation className="size-3.5 shrink-0 text-sky-600" aria-hidden />
                  {t("sampleMapsCta")}
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-black/[0.06] bg-canvas-muted/50 p-4 text-center sm:p-5">
            <p className="text-xs font-semibold text-muted">{t("preview")}</p>
            <p className="mt-1 text-[0.65rem] leading-snug text-muted">{title}</p>
          </div>
        </div>
      </div>

      <div className="order-1 space-y-6 lg:order-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand">Davetio</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">{intro}</p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-1 rounded-full bg-soft-gold-muted px-2.5 py-1 text-xs font-semibold text-ink">
              ★ 4,9
            </span>
            <span className="text-muted">{t("reviews")}</span>
            <span className="rounded-full bg-brand-muted px-2.5 py-1 text-xs font-bold text-brand">
              {t("saveBadge")}
            </span>
          </div>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-muted">{t("packagesTitle")}</p>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-2">
            {packages.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPkg(p.id)}
                className={cn(
                  "rounded-xl border px-3 py-2.5 text-left text-xs font-semibold transition-all duration-200 sm:text-sm",
                  pkg === p.id
                    ? "border-brand bg-brand-muted text-ink shadow-sm"
                    : "border-black/[0.08] bg-white text-muted hover:border-brand/35",
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-muted">{t("featuresTitle")}</p>
          <ul className="mt-3 space-y-2.5">
            {features.map((line, i) => {
              const Icon = featureIcons[Math.min(i, featureIcons.length - 1)];
              return (
                <li
                  key={line}
                  className="flex gap-3 rounded-xl border border-black/[0.06] bg-white px-3 py-2.5 text-sm text-ink shadow-sm"
                >
                  <Icon
                    className="mt-0.5 size-4 shrink-0 text-brand"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                  <span>{line}</span>
                </li>
              );
            })}
          </ul>
        </div>

        <Link
          href={`/olustur?template=${encodeURIComponent(slug)}&pkg=${encodeURIComponent(pkg)}`}
          className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-hover py-3.5 text-sm font-bold text-white shadow-[var(--shadow-button)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow)] sm:w-auto sm:min-w-[220px] sm:px-10"
        >
          {t("cta")}
        </Link>
      </div>
    </div>
  );
}
