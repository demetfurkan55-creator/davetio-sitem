"use client";

import { motion } from "framer-motion";
import { MapPin, Navigation } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createInviteOpeningPianoBlobUrl } from "@/lib/invite-opening-audio";
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

const FLAP_MS = 1500;
const FLAP_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.42,
    },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.48, ease: FLAP_EASE },
  },
};

/**
 * Dijital davetiye önizlemesi: zarf kapağı + mühür açılışı (framer-motion),
 * arka planda sessiz video; açılışta prosedürel piyano WAV (HTML5 audio).
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
  const audioRef = useRef<HTMLAudioElement>(null);
  const [videoReady, setVideoReady] = useState(true);
  const [unlocked, setUnlocked] = useState(false);
  const isStudio = variant === "studio";
  const showFooter = showTemplateFooter ?? !isStudio;
  const useSplitNames =
    isStudio &&
    typeof coupleFirstName === "string" &&
    typeof coupleSecondName === "string" &&
    (coupleFirstName.trim() !== "" || coupleSecondName.trim() !== "");

  const reopenKey = `${videoSrc}|${templateName}|${previewNames}|${previewDate}`;

  useEffect(() => {
    setUnlocked(false);
  }, [reopenKey]);

  useEffect(() => {
    const url = createInviteOpeningPianoBlobUrl();
    const a = audioRef.current;
    if (a) a.src = url;
    return () => {
      URL.revokeObjectURL(url);
    };
  }, []);

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

  const handleOpenSeal = useCallback(() => {
    if (unlocked) return;
    setUnlocked(true);
    const a = audioRef.current;
    if (a) {
      a.volume = 0.45;
      void a.play().catch(() => {});
    }
  }, [unlocked]);

  return (
    <div
      className={cn(
        "relative mx-auto overflow-hidden rounded-[1.35rem] border border-white/25 bg-[#faf7f4] shadow-[0_20px_50px_-20px_rgba(45,35,30,0.38)] ring-1 ring-white/60",
        isStudio
          ? "max-w-[min(100%,20rem)] shadow-[0_28px_90px_-32px_rgba(20,31,56,0.55)] ring-2 ring-white/30 sm:max-w-[min(100%,22rem)]"
          : "max-w-[300px]",
      )}
    >
      <audio ref={audioRef} preload="auto" className="hidden" aria-hidden playsInline />

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
          <div className="absolute inset-0 bg-gradient-to-br from-brand/35 via-wine/25 to-ink/90" aria-hidden />
        )}

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
          <motion.div
            className={cn(
              "relative w-full overflow-hidden rounded-2xl border shadow-[0_18px_40px_-12px_rgba(0,0,0,0.45)] ring-1",
              "border-white/35 bg-gradient-to-br from-white/[0.22] via-white/[0.12] to-white/[0.06]",
              "backdrop-blur-2xl backdrop-saturate-150",
              isStudio ? "max-w-[min(100%,19rem)] sm:max-w-[18.5rem]" : "max-w-[248px]",
            )}
            aria-hidden={!unlocked}
            style={
              heroImage
                ? {
                    backgroundImage: `linear-gradient(145deg, rgba(255,255,255,${isStudio ? 0.38 : 0.42}), rgba(253,251,247,${isStudio ? 0.2 : 0.28})), url(${heroImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : undefined
            }
            initial={false}
            animate={
              unlocked
                ? { opacity: 1, scale: 1 }
                : {
                    opacity: 0,
                    scale: 0.9,
                  }
            }
            transition={{ duration: FLAP_MS / 1000, ease: FLAP_EASE }}
          >
            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[linear-gradient(135deg,rgba(255,255,255,0.5)_0%,transparent_42%,rgba(198,160,74,0.06)_100%)]" />

            <motion.div
              className={cn(
                "relative text-center",
                isStudio ? "px-4 pb-4 pt-6 sm:px-5 sm:pb-5 sm:pt-7" : "px-4 pb-3 pt-5 sm:px-5 sm:pb-4 sm:pt-6",
              )}
              variants={staggerContainer}
              initial="hidden"
              animate={unlocked ? "visible" : "hidden"}
            >
              <motion.p
                variants={staggerItem}
                className={cn(
                  "font-bold uppercase tracking-[0.32em] text-brand/90",
                  isStudio ? "text-[0.58rem] sm:text-[0.6rem]" : "text-[0.55rem]",
                )}
              >
                {previewEyebrow}
              </motion.p>

              {useSplitNames ? (
                <motion.div variants={staggerItem} className="mt-4 min-h-[5.5rem] space-y-1">
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
                </motion.div>
              ) : (
                <motion.p
                  variants={staggerItem}
                  className={cn(
                    "mt-2.5 font-display font-bold leading-[1.1] tracking-tight text-ink",
                    isStudio ? "text-[clamp(1.2rem,4.5vw,1.65rem)]" : "text-[1.45rem] sm:text-[1.55rem]",
                  )}
                >
                  {previewNames}
                </motion.p>
              )}

              <motion.p
                variants={staggerItem}
                className={cn(
                  "mt-3 font-medium leading-snug text-muted",
                  isStudio ? "text-[0.72rem] sm:text-[0.74rem]" : "text-[0.68rem]",
                )}
              >
                {previewTagline}
              </motion.p>
              <motion.p
                variants={staggerItem}
                className={cn(
                  "mt-1.5 font-display font-semibold text-ink/90",
                  isStudio ? "text-[0.88rem] sm:text-[0.92rem]" : "text-[0.82rem]",
                )}
              >
                {previewDate}
              </motion.p>
              <motion.p
                variants={staggerItem}
                className={cn(
                  "mt-2 flex items-center justify-center gap-1 font-medium text-muted",
                  isStudio ? "text-[0.64rem] leading-snug sm:text-[0.66rem]" : "text-[0.62rem]",
                )}
              >
                <MapPin className="size-3 shrink-0 text-brand" aria-hidden />
                <span className="line-clamp-3">{previewVenue}</span>
              </motion.p>

              <motion.div
                variants={staggerItem}
                className="relative mt-4 overflow-hidden rounded-xl border border-white/30 bg-white/[0.12] shadow-inner ring-1 ring-ink/[0.06] backdrop-blur-md"
              >
                <img
                  src={INVITE_MAP_STATIC_URL}
                  alt=""
                  className={cn("w-full object-cover object-center", isStudio ? "h-[4.75rem] sm:h-[5.25rem]" : "h-[4.5rem] sm:h-[5rem]")}
                  loading="lazy"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/25 to-transparent" />
                <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center gap-1.5 rounded-lg bg-white/90 px-2 py-1.5 shadow-md ring-1 ring-seal-gold/15 backdrop-blur-sm">
                  <Navigation className="size-3.5 shrink-0 text-sky-600" aria-hidden />
                  <span className="min-w-0 truncate text-[0.58rem] font-semibold uppercase tracking-wide text-ink">
                    {previewMapsCta}
                  </span>
                </div>
              </motion.div>

              {showFooter ? (
                <motion.p
                  variants={staggerItem}
                  className="mt-3 border-t border-white/25 pt-2.5 text-[0.62rem] font-medium text-muted"
                >
                  {templateName}
                </motion.p>
              ) : null}
            </motion.div>
          </motion.div>
        </div>

        {/* Zarf kapağı + mühür — davetiye metni kapalıyken tam üstte */}
        <motion.div
          className={cn(
            "absolute inset-0 z-[36] flex flex-col items-center justify-center",
            "bg-gradient-to-b from-[#3a3834] via-[#2c2a26] to-[#1e1c1a]",
            "shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_-12px_40px_rgba(0,0,0,0.35)]",
          )}
          initial={false}
          animate={unlocked ? { y: "-100%" } : { y: 0 }}
          transition={{ duration: FLAP_MS / 1000, ease: FLAP_EASE }}
          style={{
            willChange: "transform",
            pointerEvents: unlocked ? "none" : "auto",
          }}
          aria-hidden={unlocked}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.14]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            }}
          />
          <div className="pointer-events-none absolute inset-x-8 top-[18%] h-px bg-gradient-to-r from-transparent via-[#c6a04a]/25 to-transparent" />
          <div className="pointer-events-none absolute inset-x-10 bottom-[22%] h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />

          {!unlocked ? (
            <motion.button
              type="button"
              onClick={handleOpenSeal}
              className={cn(
                "relative z-10 flex size-[min(11.5rem,72vw)] max-h-[46%] flex-col items-center justify-center gap-2 rounded-full",
                "border-2 border-[#dcc896]/90 bg-gradient-to-br from-[#e8d9a8] via-[#c6a04a] to-[#9a7b38]",
                "text-[#2a2618] shadow-[0_12px_40px_rgba(0,0,0,0.45),inset_0_2px_0_rgba(255,255,255,0.45)]",
                "outline-none ring-[3px] ring-[#c6a04a]/35 ring-offset-4 ring-offset-[#2c2a26] transition-transform focus-visible:ring-[#dcc896]",
              )}
              aria-label="Davetiyeyi aç"
              whileTap={{ scale: 0.96 }}
              animate={{
                scale: [1, 1.045, 1],
                boxShadow: [
                  "0 12px 40px rgba(0,0,0,0.45), inset 0 2px 0 rgba(255,255,255,0.45), 0 0 0 0 rgba(198,160,74,0.35)",
                  "0 16px 48px rgba(0,0,0,0.5), inset 0 2px 0 rgba(255,255,255,0.5), 0 0 0 14px rgba(198,160,74,0)",
                  "0 12px 40px rgba(0,0,0,0.45), inset 0 2px 0 rgba(255,255,255,0.45), 0 0 0 0 rgba(198,160,74,0.35)",
                ],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <span className="px-5 text-center font-display text-[clamp(0.95rem,3.8vw,1.12rem)] font-semibold leading-snug">
                Davetiyeyi Aç
              </span>
            </motion.button>
          ) : null}
        </motion.div>
      </div>
    </div>
  );
}
