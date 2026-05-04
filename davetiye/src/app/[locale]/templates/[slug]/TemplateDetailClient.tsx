"use client";

import { useLocale, useTranslations } from "next-intl";
import { Calendar, Clock, Globe, Music, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useCallback, useMemo, useState } from "react";
import { getTemplatePreviewDemo } from "@/lib/template-preview-demo";
import { getThemeIdForTemplateSlug } from "@/lib/template-slug-theme";
import { resolveInviteVideoUrl } from "@/lib/invite-ambient-video";
import { cn } from "@/lib/utils";
import { InvitationPreview } from "@/components/InvitationPreview";
import {
  InvitationPreviewStage,
  splitInvitationVenueLine,
} from "@/components/davetio/InvitationPreviewStage";

const featureIcons = [Clock, Music, Globe, Calendar] as const;

export function TemplateDetailClient({
  slug,
  title,
  intro,
}: {
  slug: string;
  title: string;
  intro: string;
}) {
  const locale = useLocale();
  const mapDemo = getTemplatePreviewDemo(slug, locale);
  const themeId = getThemeIdForTemplateSlug(slug);
  const t = useTranslations("TemplateDetail");
  const tModal = useTranslations("Landing.previewModal");
  const packages = t.raw("packages") as { id: string; label: string }[];
  const features = t.raw("features") as string[];
  const [pkg, setPkg] = useState(packages[0]?.id ?? "solo");
  const [fullOpen, setFullOpen] = useState(false);

  const videoSrc = useMemo(
    () => resolveInviteVideoUrl({ messageFallback: tModal("videoSrc") }),
    [tModal],
  );

  const venueParts = useMemo(() => splitInvitationVenueLine(mapDemo.previewVenue), [mapDemo.previewVenue]);

  const closeFull = useCallback(() => setFullOpen(false), []);

  return (
    <div className="mx-auto grid min-w-0 max-w-6xl gap-10 px-4 py-10 sm:px-6 sm:px-8 lg:grid-cols-2 lg:items-start lg:gap-14 lg:py-14">
      <div className="order-2 lg:order-1">
        <div className="rounded-[2rem] border border-[#e8d5df]/80 bg-[#fdf5f8]/95 p-4 shadow-[0_24px_70px_-40px_rgba(74,20,40,0.18)] backdrop-blur-md sm:p-6">
          <InvitationPreviewStage
            variant="card"
            theme={themeId}
            startUnlocked
            showTemplateFooter
            videoSrc={videoSrc}
            previewEyebrow={mapDemo.previewEyebrow}
            previewNames={mapDemo.previewNames}
            previewTagline={mapDemo.previewTagline}
            previewDate={mapDemo.previewDate}
            previewVenue={mapDemo.previewVenue}
            previewMapsCta={mapDemo.previewMapsCta}
            mapEmbedUrl={mapDemo.mapEmbedUrl}
            mapsOpenUrl={mapDemo.mapsOpenUrl}
            templateName={title}
          />

          <button
            type="button"
            onClick={() => setFullOpen(true)}
            className="mt-5 flex w-full items-center justify-center rounded-2xl border-2 border-[#6b1d2e] bg-[#6b1d2e] px-4 py-3.5 text-sm font-bold tracking-wide text-white shadow-[0_14px_40px_-18px_rgba(74,20,40,0.45)] transition hover:bg-[#551825]"
          >
            {t("fullScreenCta")}
          </button>

          <p className="mt-3 text-center text-[0.68rem] font-medium text-[#6b1d2e]/75">{t("previewNote")}</p>
        </div>
      </div>

      <div className="order-1 space-y-6 lg:order-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6b1d2e]">Davetio</p>
          <h1 className="mt-2 font-display text-2xl font-extrabold leading-tight tracking-tight text-[#4a1420] sm:text-3xl md:text-4xl">
            {title}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[#5e3d47] sm:text-base">{intro}</p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-1 rounded-full border border-[#dfc896]/60 bg-[#fcf6ee] px-2.5 py-1 text-xs font-semibold text-[#5c1428]">
              ★ 4,9
            </span>
            <span className="text-[#6b4a52]">{t("reviews")}</span>
            <span className="rounded-full border border-[#dfc896]/50 bg-white/80 px-2.5 py-1 text-xs font-bold text-[#6b1d2e]">
              {t("saveBadge")}
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-[#e8d0dc]/90 bg-white/70 p-4 shadow-sm backdrop-blur-sm sm:p-5">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#6b1d2e]">{t("packagesTitle")}</p>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-2">
            {packages.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPkg(p.id)}
                className={cn(
                  "relative rounded-2xl border px-3 py-3 text-left text-xs font-semibold transition-all duration-300 sm:text-sm",
                  pkg === p.id
                    ? "border-[#c9a44a] bg-gradient-to-br from-[#fffefb] to-[#faf0e6] text-[#4a1420] shadow-[0_12px_36px_-24px_rgba(107,29,46,0.35)] ring-2 ring-[#dfc896]/60"
                    : "border-[#e8d5df]/90 bg-white/90 text-[#6b4a52] hover:border-[#dfc896]/80 hover:bg-[#fffefb]",
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[#e8d0dc]/90 bg-white/70 p-4 shadow-sm backdrop-blur-sm sm:p-5">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#6b1d2e]">{t("featuresTitle")}</p>
          <ul className="mt-3 space-y-2.5">
            {features.map((line, i) => {
              const Icon = featureIcons[Math.min(i, featureIcons.length - 1)];
              return (
                <li
                  key={line}
                  className="flex gap-3 rounded-xl border border-[#f0dce6]/90 bg-gradient-to-r from-white/95 to-[#fdf8fa]/95 px-3 py-2.5 text-sm text-[#3d1822] shadow-[0_8px_28px_-22px_rgba(74,20,40,0.2)]"
                >
                  <Icon
                    className="mt-0.5 size-4 shrink-0 text-[#b8943f]"
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
          className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-br from-[#6b1d2e] to-[#551825] py-3.5 text-sm font-bold text-white shadow-[var(--shadow-button)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow)] sm:w-auto sm:min-w-[220px] sm:px-10"
        >
          {t("cta")}
        </Link>
      </div>

      {fullOpen ? (
        <div
          className="fixed inset-0 z-[100] flex flex-col bg-[#0a0608]"
          role="dialog"
          aria-modal="true"
          aria-label={t("fullScreenCta")}
        >
          <button
            type="button"
            onClick={closeFull}
            className="absolute right-4 top-4 z-[110] flex size-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20"
            aria-label={t("fullScreenClose")}
          >
            <X className="size-5" aria-hidden />
          </button>
          <div className="relative min-h-0 flex-1 overflow-hidden">
            <InvitationPreview
              variant="fullscreen"
              theme={themeId}
              skipEnvelope
              namesDisplay={mapDemo.previewNames}
              eyebrow={mapDemo.previewEyebrow}
              invitationLine={mapDemo.previewTagline}
              dateLine={mapDemo.previewDate}
              story={mapDemo.previewTagline}
              venueTitle={venueParts.title}
              venueDetail={venueParts.detail}
              mapEmbedUrl={mapDemo.mapEmbedUrl}
              mapsOpenUrl={mapDemo.mapsOpenUrl}
              mapsButtonLabel={mapDemo.previewMapsCta}
              templateFooter={title}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
