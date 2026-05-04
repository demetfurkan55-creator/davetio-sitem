"use client";

import {
  InvitationThemeBackdrop,
  ThemeFloralEdges,
} from "@/components/invite/InvitationThemeBackdrop";
import { ScratchGoldCoins } from "@/components/invite/ScratchGoldCoins";
import { InviteMusicFab } from "@/components/invite/InviteMusicFab";
import {
  getInvitationThemeTokens,
  resolveInvitationTheme,
  type InvitationThemeId,
  type InvitationThemeTokens,
} from "@/lib/invitation-themes";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown, MapPin } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

const SNAP_MAX = 4;

function useCountdown(targetIso: string) {
  const [parts, setParts] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const target = useMemo(() => new Date(targetIso).getTime(), [targetIso]);

  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      let diff = Math.max(0, target - now);
      const d = Math.floor(diff / 86400000);
      diff %= 86400000;
      const h = Math.floor(diff / 3600000);
      diff %= 3600000;
      const m = Math.floor(diff / 60000);
      diff %= 60000;
      const s = Math.floor(diff / 1000);
      setParts({ d, h, m, s });
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [target]);

  return parts;
}

function pad2(n: number) {
  return n.toString().padStart(2, "0");
}

export type InvitationPreviewProps = {
  namesDisplay: string;
  eyebrow?: string;
  invitationLine: string;
  dateLine: string;
  eventAt?: string;
  story: string;
  venueTitle: string;
  venueDetail: string;
  mapEmbedUrl: string;
  mapsOpenUrl: string;
  mapsButtonLabel?: string;
  rsvpHint?: string;
  templateFooter?: string;
  calendarUrl?: string;
  variant?: "fullscreen" | "embedded";
  /** wedding | henna | engagement | nikah veya filterId */
  theme?: InvitationThemeId | string | null;
  /** Önizleme modunda zarf atlanır */
  skipEnvelope?: boolean;
};

function resolveEventAt(iso?: string) {
  if (iso && !Number.isNaN(Date.parse(iso))) return iso;
  return new Date(Date.now() + 90 * 86400000).toISOString();
}

type SlideProps = {
  children: React.ReactNode;
  className?: string;
  sectionMinClass: string;
  innerMinClass: string;
  tokens: InvitationThemeTokens;
};

function Slide({ children, className, sectionMinClass, innerMinClass, tokens }: SlideProps) {
  const reduce = useReducedMotion();
  return (
    <section
      className={cn(
        "relative z-10 flex snap-start snap-always flex-col [scroll-snap-stop:always]",
        sectionMinClass,
        className,
      )}
    >
      <ThemeFloralEdges tokens={tokens} />
      <motion.div
        className={cn("relative z-[1] flex flex-1 flex-col", innerMinClass)}
        initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 }}
        whileInView={reduce ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.28 }}
        transition={{ duration: reduce ? 0.2 : 0.65, ease }}
      >
        {children}
      </motion.div>
    </section>
  );
}

function EnvelopeIntro({
  tokens,
  onOpen,
  reduce,
}: {
  tokens: InvitationThemeTokens;
  onOpen: () => void;
  reduce: boolean;
}) {
  const [flap, setFlap] = useState(false);

  const handleOpen = () => {
    if (flap) return;
    setFlap(true);
    window.setTimeout(() => onOpen(), reduce ? 50 : 700);
  };

  return (
    <motion.div
      className="flex min-h-0 flex-1 flex-col items-center justify-center px-6 py-10"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: reduce ? 0.12 : 0.45, ease }}
    >
      <p
        className="mb-8 text-center text-[0.65rem] font-semibold uppercase tracking-[0.38em] opacity-75"
        style={{ color: tokens.textMuted }}
      >
        Özel davet
      </p>
      <button
        type="button"
        onClick={handleOpen}
        className="relative w-full max-w-[min(100%,280px)] outline-none focus-visible:ring-2 focus-visible:ring-offset-2 [perspective:900px]"
        style={{ "--tw-ring-color": tokens.accent } as React.CSSProperties}
        aria-label="Zarfı aç"
      >
        <div
          className="relative overflow-hidden rounded-2xl shadow-[0_28px_70px_-28px_rgba(0,0,0,0.25)] [transform-style:preserve-3d]"
          style={{
            aspectRatio: "4/3",
            background: `linear-gradient(165deg, ${tokens.cardBg} 0%, ${tokens.pageBg} 100%)`,
            borderWidth: 1,
            borderColor: tokens.borderSubtle,
          }}
        >
          <div
            className="absolute inset-x-0 top-0 h-[48%] origin-top"
            style={{
              background: `linear-gradient(180deg, ${tokens.countdownBg} 0%, ${tokens.cardBg} 100%)`,
              transform: flap ? "rotateX(-168deg)" : "rotateX(0deg)",
              transformStyle: "preserve-3d",
              transition: reduce ? "none" : "transform 0.65s cubic-bezier(0.22,1,0.36,1)",
              zIndex: 2,
              borderBottomWidth: 1,
              borderColor: tokens.borderSubtle,
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 3 }}>
            <motion.div
              className="flex size-[4.5rem] items-center justify-center rounded-full shadow-[0_12px_36px_rgba(0,0,0,0.18)] ring-2 ring-[#c9a44a]/70 ring-offset-2 ring-offset-transparent"
              style={{
                background: `radial-gradient(circle at 30% 25%, #eedfa4 0%, #c9a44a 38%, #8a6228 100%)`,
              }}
              animate={flap ? { scale: [1, 1.06, 0.92], opacity: [1, 1, 0] } : { scale: 1, opacity: 1 }}
              transition={{ duration: reduce ? 0.1 : 0.55 }}
            >
              <span className="font-display text-lg italic text-[#2a0a0d] opacity-90">D</span>
            </motion.div>
          </div>
          <div
            className="absolute bottom-0 left-0 right-0 h-[35%] opacity-40"
            style={{
              background: `linear-gradient(0deg, ${tokens.textPrimary}18, transparent)`,
            }}
          />
        </div>
        <p className="mt-5 text-center text-xs font-medium tracking-wide opacity-80" style={{ color: tokens.textMuted }}>
          Mührü dokunarak açın
        </p>
      </button>
    </motion.div>
  );
}

export function InvitationPreview({
  namesDisplay,
  eyebrow,
  invitationLine,
  dateLine,
  eventAt,
  story: _story,
  venueTitle,
  venueDetail,
  mapEmbedUrl,
  mapsOpenUrl,
  mapsButtonLabel = "Yol Tarifi",
  rsvpHint,
  templateFooter,
  calendarUrl,
  variant = "fullscreen",
  theme,
  skipEnvelope = false,
}: InvitationPreviewProps) {
  void _story;
  const reduce = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeSnap, setActiveSnap] = useState(0);
  const [party, setParty] = useState(1);
  const [attend, setAttend] = useState<"yes" | "no" | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [unlocked, setUnlocked] = useState(() => skipEnvelope || Boolean(reduce));
  const [playMusicKey, setPlayMusicKey] = useState(0);

  const themeId = resolveInvitationTheme(theme ?? undefined);
  const tok = getInvitationThemeTokens(themeId);
  const targetIso = useMemo(() => resolveEventAt(eventAt), [eventAt]);
  const countdown = useCountdown(targetIso);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const { scrollTop, clientHeight } = el;
      const i = Math.round(scrollTop / Math.max(clientHeight, 1));
      setActiveSnap(Math.min(SNAP_MAX, Math.max(0, i)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const bumpParty = useCallback((delta: number) => {
    setParty((p) => Math.min(20, Math.max(1, p + delta)));
  }, []);

  const openEnvelope = useCallback(() => {
    setUnlocked(true);
    setPlayMusicKey((k) => k + 1);
  }, []);

  const sectionMin =
    variant === "embedded"
      ? "min-h-full w-full"
      : "w-full min-h-[100dvh] supports-[min-height:100svh]:min-h-[100svh]";
  const innerMin =
    variant === "embedded" ? "min-h-full" : "min-h-[100dvh] supports-[min-height:100svh]:min-h-[100svh]";

  const rootClass =
    variant === "fullscreen"
      ? "relative isolate min-h-[100dvh] text-[color:var(--inv-fg)] supports-[height:100svh]:min-h-[100svh]"
      : "relative isolate flex min-h-0 flex-1 flex-col overflow-hidden text-[color:var(--inv-fg)]";

  const scrollWrapClass = cn(
    "davetio-invite-scroll davetio-scrollbar-hide snap-y snap-mandatory overflow-y-auto overflow-x-hidden",
    variant === "fullscreen"
      ? "h-[100dvh] supports-[height:100svh]:h-[100svh]"
      : "min-h-0 flex-1 basis-0",
  );

  const dotsWrap = cn(
    "top-1/2 z-30 flex -translate-y-1/2 flex-col gap-1.5",
    variant === "fullscreen" ? "fixed right-3 sm:right-5" : "absolute right-1.5",
  );

  const musicPlacement = variant === "fullscreen" ? "fixed" : "absolute";

  const cssVars = {
    "--inv-fg": tok.textPrimary,
    "--inv-muted": tok.textMuted,
    "--inv-accent": tok.accent,
  } as React.CSSProperties;

  const titleFont =
    tok.id === "nikah"
      ? "font-sans text-[clamp(1.65rem,6.5vw,2.75rem)] font-medium tracking-tight"
      : "font-display text-[clamp(1.85rem,7vw,3rem)] font-normal italic";

  return (
    <div
      className={cn(rootClass, variant === "embedded" && "rounded-[inherit]")}
      style={{ ...cssVars, backgroundColor: tok.pageBg }}
    >
      <div className="pointer-events-none absolute inset-0 z-0">
        <InvitationThemeBackdrop tokens={tok} />
      </div>

      <InviteMusicFab
        placement={musicPlacement}
        className={tok.musicFabClass}
        spinActive={unlocked}
        playAttemptKey={playMusicKey}
      />

      {unlocked ? (
        <div className={dotsWrap}>
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className={cn(
                "block rounded-full transition-all duration-300",
                variant === "embedded" ? "h-1.5 w-1.5" : "h-2 w-2",
                activeSnap === i ? "scale-125 shadow-[0_0_10px_currentColor]" : "opacity-40",
              )}
              style={{
                backgroundColor: activeSnap === i ? tok.dotActive : tok.dotInactive,
                color: tok.dotActive,
              }}
            />
          ))}
        </div>
      ) : null}

      <div ref={scrollRef} className={cn(scrollWrapClass, !unlocked && "pointer-events-none opacity-0")}>
        <Slide sectionMinClass={sectionMin} innerMinClass={innerMin} tokens={tok}>
          <motion.div
            key={skipEnvelope ? "skip-cover" : `cover-${playMusicKey}`}
            className={cn(
              "flex flex-1 flex-col items-center justify-center px-5 pb-24 pt-[max(3rem,env(safe-area-inset-top))] text-center",
              innerMin,
            )}
            initial={reduce || skipEnvelope ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0.15 : 0.75, ease, delay: reduce || skipEnvelope ? 0 : 0.12 }}
          >
            {eyebrow ? (
              <p
                className="text-[0.65rem] font-semibold uppercase tracking-[0.32em] opacity-80"
                style={{ color: tok.textMuted }}
              >
                {eyebrow}
              </p>
            ) : null}
            <h1 className={cn("mt-5 max-w-[95%] leading-[1.12]", titleFont)} style={{ color: tok.textPrimary }}>
              {namesDisplay}
            </h1>
            <p
              className={cn(
                "mt-8 max-w-md text-base leading-snug sm:text-lg",
                tok.id === "nikah" ? "font-sans font-normal" : "font-display italic",
              )}
              style={{ color: tok.textSecondary }}
            >
              {invitationLine}
            </p>
            <p className="mt-6 font-sans text-sm font-medium tracking-wide" style={{ color: tok.textMuted }}>
              {dateLine}
            </p>
          </motion.div>
          <div className="pointer-events-none absolute bottom-7 left-0 right-0 z-[2] flex flex-col items-center gap-1">
            <span
              className="text-[0.6rem] font-semibold uppercase tracking-[0.26em] opacity-60"
              style={{ color: tok.textMuted }}
            >
              Kaydırın
            </span>
            <motion.div
              animate={reduce ? {} : { y: [0, 5, 0] }}
              transition={reduce ? {} : { duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown className="size-7" strokeWidth={1.25} aria-hidden style={{ color: tok.chevron }} />
            </motion.div>
          </div>
        </Slide>

        <Slide
          sectionMinClass={sectionMin}
          innerMinClass={innerMin}
          className="justify-center px-4 py-12"
          tokens={tok}
        >
          <div className="mx-auto flex w-full max-w-md flex-col items-center text-center">
            <h2 className="font-display text-xl font-medium italic sm:text-2xl" style={{ color: tok.textPrimary }}>
              Tarihi Öğrenmek İçin Kazıyın
            </h2>
            <p className="mt-2 text-xs leading-relaxed sm:text-sm" style={{ color: tok.textMuted }}>
              Altın mühürleri parmağınızla veya imleçle silin.
            </p>
            <div className="mt-8 scale-[0.92] sm:scale-100">
              <ScratchGoldCoins dateLine={dateLine} themeId={themeId} />
            </div>
          </div>
        </Slide>

        <Slide
          sectionMinClass={sectionMin}
          innerMinClass={innerMin}
          className="justify-center px-3 py-10 sm:px-6"
          tokens={tok}
        >
          <div className="mx-auto w-full max-w-lg space-y-8">
            <div className="text-center">
              <h2 className="font-display text-xl font-semibold sm:text-2xl" style={{ color: tok.textPrimary }}>
                Geri Sayım
              </h2>
              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                {[
                  { label: "Gün", value: String(countdown.d) },
                  { label: "Saat", value: pad2(countdown.h) },
                  { label: "Dakika", value: pad2(countdown.m) },
                  { label: "Saniye", value: pad2(countdown.s) },
                ].map((cell) => (
                  <div
                    key={cell.label}
                    className="rounded-2xl border px-3 py-4 shadow-[0_12px_32px_-18px_rgba(0,0,0,0.12)]"
                    style={{
                      backgroundColor: tok.countdownBg,
                      borderColor: tok.countdownBorder,
                    }}
                  >
                    <p
                      className="text-[0.58rem] font-semibold uppercase tracking-[0.18em]"
                      style={{ color: tok.countdownLabel }}
                    >
                      {cell.label}
                    </p>
                    <p
                      className="mt-2 font-display text-2xl font-semibold tabular-nums sm:text-3xl"
                      style={{ color: tok.countdownNumber }}
                    >
                      {cell.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center gap-2" style={{ color: tok.accent }}>
                <MapPin className="size-3.5" aria-hidden />
                <span
                  className="text-[0.6rem] font-semibold uppercase tracking-[0.22em] opacity-85"
                  style={{ color: tok.textMuted }}
                >
                  {tok.id === "nikah" ? "Tören Yeri" : "Düğün Yeri"}
                </span>
              </div>
              <p className="mt-3 font-display text-xl font-semibold sm:text-2xl" style={{ color: tok.textPrimary }}>
                {venueTitle}
              </p>
              <p className="mt-2 font-sans text-sm font-medium" style={{ color: tok.textSecondary }}>
                {dateLine}
              </p>
              <p
                className="mt-3 whitespace-pre-line text-xs leading-relaxed sm:text-sm"
                style={{ color: tok.textMuted }}
              >
                {venueDetail}
              </p>
            </div>

            <div
              className="davetio-invite-map overflow-hidden rounded-2xl shadow-[0_14px_40px_-24px_rgba(0,0,0,0.18)]"
              style={{ borderWidth: 1, borderColor: tok.borderSubtle }}
            >
              <iframe
                title="Mekân haritası"
                src={mapEmbedUrl}
                className="aspect-[16/10] h-[min(42vw,220px)] w-full sm:h-[240px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
              {calendarUrl ? (
                <a
                  href={calendarUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex flex-1 items-center justify-center rounded-full px-5 py-3.5 text-center text-sm font-semibold transition hover:opacity-95 sm:flex-none"
                  style={{
                    backgroundColor: tok.btnPrimary,
                    color: "#fff",
                    boxShadow: `0 12px 32px -12px ${tok.btnPrimary}66`,
                  }}
                >
                  Takvime Kaydet
                </a>
              ) : null}
              <a
                href={mapsOpenUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex flex-1 items-center justify-center rounded-full border-2 px-6 py-3.5 text-center text-sm font-semibold transition hover:opacity-95 sm:flex-none"
                style={{
                  borderColor: tok.textPrimary,
                  backgroundColor: tok.cardBg,
                  color: tok.textPrimary,
                }}
              >
                {mapsButtonLabel}
              </a>
            </div>
          </div>
        </Slide>

        <Slide
          sectionMinClass={sectionMin}
          innerMinClass={innerMin}
          className="justify-start px-3 py-8 sm:px-5"
          tokens={tok}
        >
          <div
            className={cn("mx-auto flex w-full max-w-md flex-col pb-[env(safe-area-inset-bottom)] pt-4", innerMin)}
          >
            <h2 className="text-center font-display text-xl font-semibold" style={{ color: tok.textPrimary }}>
              Katılımını Onayla
            </h2>
            <form
              className="mt-6 space-y-5 rounded-[1.35rem] border px-5 py-7 shadow-[0_18px_50px_-30px_rgba(0,0,0,0.12)]"
              style={{
                borderColor: tok.cardBorder,
                backgroundColor: tok.cardBg,
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
              }}
              onSubmit={(e) => e.preventDefault()}
            >
              <label className="block">
                <span
                  className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.12em]"
                  style={{ color: tok.textMuted }}
                >
                  Ad Soyad
                </span>
                <input
                  type="text"
                  placeholder="Örn. Ayşe Yılmaz"
                  className="w-full rounded-xl border px-3 py-3 text-sm outline-none"
                  style={{
                    borderColor: tok.borderSubtle,
                    backgroundColor: tok.id === "henna" ? "rgba(20,4,6,0.35)" : "#fff",
                    color: tok.textPrimary,
                  }}
                />
              </label>
              <div>
                <span
                  className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.12em]"
                  style={{ color: tok.textMuted }}
                >
                  Kişi sayısı
                </span>
                <div
                  className="flex items-center justify-center gap-3 rounded-xl border px-3 py-2.5"
                  style={{
                    borderColor: tok.borderSubtle,
                    backgroundColor: tok.id === "henna" ? "rgba(24,6,8,0.4)" : "rgba(255,255,255,0.95)",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => bumpParty(-1)}
                    className="flex size-10 items-center justify-center rounded-full border"
                    style={{ borderColor: tok.borderSubtle, color: tok.textPrimary }}
                  >
                    −
                  </button>
                  <span className="min-w-[2ch] font-display text-xl font-semibold" style={{ color: tok.textPrimary }}>
                    {party}
                  </span>
                  <button
                    type="button"
                    onClick={() => bumpParty(1)}
                    className="flex size-10 items-center justify-center rounded-full border"
                    style={{ borderColor: tok.borderSubtle, color: tok.textPrimary }}
                  >
                    +
                  </button>
                </div>
              </div>
              <div>
                <span
                  className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.12em]"
                  style={{ color: tok.textMuted }}
                >
                  Katılım
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAttend("yes")}
                    className="rounded-xl border py-3 text-sm font-semibold"
                    style={
                      attend === "yes"
                        ? { borderColor: tok.btnPrimary, backgroundColor: tok.btnPrimary, color: "#fff" }
                        : { borderColor: tok.borderSubtle, backgroundColor: tok.cardBg, color: tok.textSecondary }
                    }
                  >
                    Evet
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttend("no")}
                    className="rounded-xl border py-3 text-sm font-semibold"
                    style={
                      attend === "no"
                        ? { borderColor: tok.btnPrimary, backgroundColor: tok.btnPrimary, color: "#fff" }
                        : { borderColor: tok.borderSubtle, backgroundColor: tok.cardBg, color: tok.textSecondary }
                    }
                  >
                    Hayır
                  </button>
                </div>
              </div>
              {rsvpHint ? (
                <p className="text-center text-[0.65rem] leading-relaxed" style={{ color: tok.textMuted }}>
                  {rsvpHint}
                </p>
              ) : null}
              <button
                type="submit"
                className="w-full rounded-full py-3.5 text-sm font-semibold text-white shadow-[0_12px_36px_-12px_rgba(0,0,0,0.25)]"
                style={{ backgroundColor: tok.btnPrimary }}
              >
                Gönder
              </button>
            </form>
          </div>
        </Slide>

        <Slide
          sectionMinClass={sectionMin}
          innerMinClass={innerMin}
          className="justify-center px-4 py-12"
          tokens={tok}
        >
          <div className="mx-auto w-full max-w-md">
            <h2 className="text-center font-display text-xl font-semibold sm:text-2xl" style={{ color: tok.textPrimary }}>
              Anı Bırakın
            </h2>
            <p className="mt-3 text-center text-xs leading-relaxed sm:text-sm" style={{ color: tok.textMuted }}>
              Fotoğraf, kısa video veya ses ile bu güne eşlik edin.
            </p>
            <input ref={fileInputRef} type="file" accept="image/*,video/*,audio/*" className="sr-only" multiple />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mx-auto mt-8 flex min-h-[104px] w-full max-w-[260px] items-center justify-center rounded-2xl border-2 bg-white/85 px-8 py-6 font-display text-base font-medium shadow-[0_14px_40px_-26px_rgba(0,0,0,0.18)] transition hover:opacity-95"
              style={{ borderColor: tok.accent, color: tok.textPrimary }}
            >
              Medya Yükle
            </button>

            <div
              className="mt-12 rounded-[2px] px-5 py-10 text-center"
              style={{
                borderWidth: 2,
                borderColor: tok.textPrimary,
                boxShadow: `inset 0 0 0 1px ${tok.accent}44`,
              }}
            >
              <p
                className="font-display text-sm italic leading-relaxed sm:text-base"
                style={{ color: tok.textSecondary }}
              >
                Teşekkürler. Bu özel günde yanımızda olduğunuz için.
              </p>
              <p className="mt-6 font-display text-2xl italic" style={{ color: tok.textPrimary }}>
                {namesDisplay}
              </p>
              {templateFooter ? (
                <p className="mt-6 text-[0.65rem]" style={{ color: tok.textMuted }}>
                  {templateFooter}
                </p>
              ) : (
                <p
                  className="mt-8 text-[0.65rem] font-medium uppercase tracking-[0.35em] opacity-45"
                  style={{ color: tok.textMuted }}
                >
                  davetio.net
                </p>
              )}
            </div>
          </div>
        </Slide>
      </div>

      <AnimatePresence>
        {!unlocked ? (
          <motion.div
            key="env"
            className={cn(
              "absolute inset-0 z-[70] flex flex-col",
              variant === "fullscreen"
                ? "min-h-[100dvh] supports-[height:100svh]:min-h-[100svh]"
                : "min-h-full",
            )}
            style={{ backgroundColor: tok.pageBg }}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0.12 : 0.4 }}
          >
            <div className="pointer-events-none absolute inset-0 z-0">
              <InvitationThemeBackdrop tokens={tok} />
            </div>
            <EnvelopeIntro tokens={tok} onOpen={openEnvelope} reduce={Boolean(reduce)} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
