"use client";

import { MapPin, Navigation } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { INVITE_MAP_STATIC_URL } from "@/lib/invite-assets";
import { cn } from "@/lib/utils";

type InvitationPreviewStageProps = {
  videoSrc: string;
  previewEyebrow: string;
  /** Birleşik isim satırı (klasik önizleme) */
  previewNames: string;
  previewDate: string;
  previewTagline: string;
  previewVenue: string;
  previewMapsCta: string;
  templateName: string;
  /** Şablon vitrin görseli; davetiye kartında hafif arka plan dokusu olarak kullanılır */
  heroImage?: string | null;
  /** vitrin modalı | oluşturma sihirbazı — studio daha geniş isim alanı */
  variant?: "card" | "studio";
  /** Studio’da alt şablon satırını gizle */
  showTemplateFooter?: boolean;
  /** Studio: gelin / damat ayrı satır (canlı yazılan isimler) */
  coupleFirstName?: string;
  coupleSecondName?: string;
};

/**
 * Dijital davetiye önizlemesi: arka planda sessiz video, önde isim / tarih / mekân.
 * Mobil: playsInline + muted (iOS otomatik oynatma).
 */
export function InvitationPreviewStage({
  videoSrc,
  previewEyebrow,
  previewNames,
  previewDate,
  previewTagline,
  previewVenue,
  previewMapsCta,
  templateName,
  heroImage,
  variant = "card",
  showTemplateFooter,
  coupleFirstName,
  coupleSecondName,
}: InvitationPreviewStageProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(true);
  const isStudio = variant === "studio";
  const showFooter = showTemplateFooter ?? !isStudio;
  const useSplitNames =
    isStudio &&
    typeof coupleFirstName === "string" &&
    typeof coupleSecondName === "string" &&
    (coupleFirstName.trim() !== "" || coupleSecondName.trim() !== "");

  useEffect(() => {
    if (!videoReady) return;
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.loop = true;
    v.playsInline = true;
    const p = v.play();
    if (p) {
      p.catch(() => setVideoReady(false));
    }
    return () => {
      v.pause();
    };
  }, [videoSrc, videoReady]);

  return (
    <div
      className={cn(
        "relative mx-auto overflow-hidden rounded-[1.35rem] border border-white/25 bg-[#faf7f4] shadow-[0_20px_50px_-20px_rgba(45,35,30,0.38)] ring-1 ring-white/60",
        isStudio
          ? "max-w-[min(100%,20rem)] shadow-[0_28px_90px_-32px_rgba(20,31,56,0.55)] ring-2 ring-white/30 sm:max-w-[min(100%,22rem)]"
          : "max-w-[300px]",
      )}
    >
      <div
        className={cn(
          "relative w-full overflow-hidden bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-950",
          isStudio ? "aspect-[9/16]" : "aspect-[3/4]",
        )}
      >
        {videoReady ? (
          <video
            ref={videoRef}
            className={cn(
              "absolute inset-0 h-full w-full object-cover [transform:translateZ(0)]",
              isStudio ? "opacity-[0.58]" : "opacity-[0.52]",
            )}
            src={videoSrc}
            muted
            playsInline
            loop
            preload="metadata"
            onError={() => setVideoReady(false)}
            aria-hidden
          />
        ) : (
          <div
            className="absolute inset-0 bg-gradient-to-br from-brand/35 via-wine/25 to-ink/90"
            aria-hidden
          />
        )}

        {/* Kenar kararması + alt okunurluk */}
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_35%,transparent_20%,rgba(0,0,0,0.35)_88%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/55 via-black/20 to-transparent"
          aria-hidden
        />

        <div
          className={cn(
            "davetio-invite-glimmer pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_55%_at_50%_22%,rgba(255,255,255,0.2),transparent_58%)]",
            isStudio && "opacity-90",
          )}
          aria-hidden
        />

        <div
          className={cn("relative z-10 flex h-full items-center justify-center", isStudio ? "p-3 sm:p-4" : "p-3 sm:p-3.5")}
        >
          <div
            className={cn(
              "relative w-full overflow-hidden rounded-2xl border shadow-[0_18px_40px_-12px_rgba(0,0,0,0.45)]",
              isStudio
                ? "max-w-[min(100%,19rem)] border-white/50 bg-white/[0.92] backdrop-blur-md backdrop-saturate-150 sm:max-w-[18.5rem]"
                : "max-w-[248px] border-white/70 bg-[#fdfbf7]",
            )}
            style={
              heroImage
                ? {
                    backgroundImage: `linear-gradient(145deg, rgba(253,251,247,${isStudio ? 0.94 : 0.97}), rgba(253,251,247,${isStudio ? 0.82 : 0.88})), url(${heroImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : undefined
            }
          >
            <div
              className={cn(
                "relative text-center",
                isStudio ? "px-4 pb-4 pt-6 sm:px-5 sm:pb-5 sm:pt-7" : "px-4 pb-3 pt-5 sm:px-5 sm:pb-4 sm:pt-6",
              )}
            >
              <p
                className={cn(
                  "font-bold uppercase tracking-[0.32em] text-brand/90",
                  isStudio ? "text-[0.58rem] sm:text-[0.6rem]" : "text-[0.55rem]",
                )}
              >
                {previewEyebrow}
              </p>

              {useSplitNames ? (
                <div className="mt-4 min-h-[5.5rem] space-y-1">
                  <p
                    className={cn(
                      "font-display font-bold leading-[1.15] tracking-tight text-ink text-balance",
                      "text-[clamp(1.35rem,5.5vw,1.85rem)]",
                    )}
                  >
                    {coupleFirstName?.trim() || "—"}
                  </p>
                  <p className="font-accent text-[1.35rem] leading-none text-seal-gold sm:text-[1.5rem]">&</p>
                  <p
                    className={cn(
                      "font-display font-bold leading-[1.15] tracking-tight text-ink text-balance",
                      "text-[clamp(1.35rem,5.5vw,1.85rem)]",
                    )}
                  >
                    {coupleSecondName?.trim() || "—"}
                  </p>
                </div>
              ) : (
                <p
                  className={cn(
                    "mt-2.5 font-display font-bold leading-[1.1] tracking-tight text-ink",
                    isStudio
                      ? "text-[clamp(1.2rem,4.5vw,1.65rem)]"
                      : "text-[1.45rem] sm:text-[1.55rem]",
                  )}
                >
                  {previewNames}
                </p>
              )}

              <p
                className={cn(
                  "mt-3 font-medium leading-snug text-muted",
                  isStudio ? "text-[0.72rem] sm:text-[0.74rem]" : "text-[0.68rem]",
                )}
              >
                {previewTagline}
              </p>
              <p
                className={cn(
                  "mt-1.5 font-display font-semibold text-ink/90",
                  isStudio ? "text-[0.88rem] sm:text-[0.92rem]" : "text-[0.82rem]",
                )}
              >
                {previewDate}
              </p>
              <p
                className={cn(
                  "mt-2 flex items-center justify-center gap-1 font-medium text-muted",
                  isStudio ? "text-[0.64rem] leading-snug sm:text-[0.66rem]" : "text-[0.62rem]",
                )}
              >
                <MapPin className="size-3 shrink-0 text-brand" aria-hidden />
                <span className="line-clamp-3">{previewVenue}</span>
              </p>

              <div className="relative mt-4 overflow-hidden rounded-xl border border-ink/[0.08] bg-ink/[0.04] shadow-inner">
                <img
                  src={INVITE_MAP_STATIC_URL}
                  alt=""
                  className={cn("w-full object-cover object-center", isStudio ? "h-[4.75rem] sm:h-[5.25rem]" : "h-[4.5rem] sm:h-[5rem]")}
                  loading="lazy"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/25 to-transparent" />
                <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center gap-1.5 rounded-lg bg-white/95 px-2 py-1.5 shadow-md ring-1 ring-ink/[0.06]">
                  <Navigation className="size-3.5 shrink-0 text-sky-600" aria-hidden />
                  <span className="min-w-0 truncate text-[0.58rem] font-semibold uppercase tracking-wide text-ink">
                    {previewMapsCta}
                  </span>
                </div>
              </div>

              {showFooter ? (
                <p className="mt-3 border-t border-ink/[0.06] pt-2.5 text-[0.62rem] font-medium text-muted">{templateName}</p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
