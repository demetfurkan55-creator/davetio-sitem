"use client";

import {
  InvitationThemeBackdrop,
  ThemeFloralEdges,
} from "@/components/invite/InvitationThemeBackdrop";
import { ScratchGoldCoins } from "@/components/invite/ScratchOff";
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
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";

const ease = [0.22, 1, 0.36, 1] as const;

/** Nokta göstergesi: 0–5 (mevcut UI) */
const SNAP_MAX = 5;
/** Kaydırılabilir son slayt indeksi (0 tabanlı) */
const SCROLL_SLIDE_MAX = 6;

/** Mekân + harita slaydı (snap indeksi 3) */
export const INVITATION_MAP_SLIDE_INDEX = 3;

export type InvitationPreviewHandle = {
  scrollToSlide: (index: number, behavior?: ScrollBehavior) => void;
};

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
        "relative z-10 flex snap-start snap-always flex-col overflow-x-hidden [scroll-snap-stop:always]",
        sectionMinClass,
        className,
      )}
    >
      <ThemeFloralEdges tokens={tokens} />
      <motion.div
        className={cn("relative z-[1] flex min-w-0 flex-1 flex-col overflow-x-hidden", innerMinClass)}
        initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        whileInView={reduce ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: reduce ? 0.2 : 0.78, ease }}
      >
        {children}
      </motion.div>
    </section>
  );
}

function FerforjeGateIllustration({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 320 120"
      className="mx-auto h-[72px] w-full max-w-[280px] sm:h-[88px] sm:max-w-[320px]"
      fill="none"
      aria-hidden
    >
      <path
        d="M8 96V44c0-18 14-32 32-32h64l24-20 24 20h64c18 0 32 14 32 32v52"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path
        d="M56 96V52c0-8 6-14 14-14h36m112 0h36c8 0 14 6 14 14v44M108 38l16 14m72 0l16-14M160 18v22"
        stroke={color}
        strokeWidth="1.5"
        opacity="0.65"
      />
      <circle cx="160" cy="62" r="5" fill={color} opacity="0.45" />
      <path
        d="M128 96c10-10 24-16 32-16s22 6 32 16"
        stroke={color}
        strokeWidth="1.4"
        opacity="0.5"
      />
    </svg>
  );
}

function EnvelopeIntro({
  tokens,
  onOpen,
  reduce,
  namesDisplay,
  invitationLine,
}: {
  tokens: InvitationThemeTokens;
  onOpen: () => void;
  reduce: boolean;
  namesDisplay: string;
  invitationLine: string;
}) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    if (open) return;
    setOpen(true);
    window.setTimeout(() => onOpen(), reduce ? 50 : 820);
  };

  const dur = reduce ? 0 : 0.72;

  return (
    <motion.div
      className="flex min-h-0 min-w-0 flex-1 flex-col items-center justify-center overflow-x-hidden px-5 py-10 sm:px-6"
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
      <div className="relative w-full max-w-[min(100%,300px)]">
        <motion.div
          className="absolute inset-[9%] z-0 flex flex-col items-center justify-center rounded-xl border px-4 py-8 text-center shadow-inner"
          style={{
            borderColor: tokens.borderSubtle,
            background: `linear-gradient(180deg, ${tokens.cardBg}ee, ${tokens.pageBg})`,
          }}
          initial={{ opacity: 0.45, y: 10 }}
          animate={open ? { opacity: 1, y: 0 } : { opacity: 0.5, y: 6 }}
          transition={{ duration: reduce ? 0.1 : 0.55, ease, delay: open && !reduce ? 0.12 : 0 }}
        >
          <p className="font-accent text-[clamp(1.2rem,5.5vw,1.85rem)] leading-[1.15]" style={{ color: tokens.textPrimary }}>
            {namesDisplay}
          </p>
          <p className="font-display mt-3 max-w-[95%] text-sm italic leading-snug sm:text-base" style={{ color: tokens.textSecondary }}>
            {invitationLine}
          </p>
        </motion.div>

        <div className="relative aspect-[4/3] w-full">
          <motion.div
            className="absolute inset-y-0 left-0 z-10 w-[50%] rounded-l-2xl border-y border-l shadow-[0_18px_50px_-28px_rgba(0,0,0,0.2)]"
            style={{
              background: `linear-gradient(118deg, ${tokens.cardBg} 0%, ${tokens.pageBg} 100%)`,
              borderColor: tokens.borderSubtle,
            }}
            initial={false}
            animate={open ? { x: "-108%" } : { x: 0 }}
            transition={{ duration: dur, ease }}
          />
          <motion.div
            className="absolute inset-y-0 right-0 z-10 w-[50%] rounded-r-2xl border-y border-r shadow-[0_18px_50px_-28px_rgba(0,0,0,0.2)]"
            style={{
              background: `linear-gradient(242deg, ${tokens.cardBg} 0%, ${tokens.pageBg} 100%)`,
              borderColor: tokens.borderSubtle,
            }}
            initial={false}
            animate={open ? { x: "108%" } : { x: 0 }}
            transition={{ duration: dur, ease }}
          />

          <button
            type="button"
            onClick={handleOpen}
            className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{ "--tw-ring-color": tokens.accent } as React.CSSProperties}
            aria-label="Mühre dokunarak zarfı açın"
          >
            <motion.div
              className="davetio-seal-pulse-motion flex size-[4.25rem] items-center justify-center rounded-full shadow-[0_14px_40px_rgba(0,0,0,0.22)] ring-2 ring-[#c9a44a]/75 ring-offset-2 ring-offset-transparent"
              style={{
                background: `radial-gradient(circle at 30% 25%, #eedfa4 0%, #c9a44a 38%, #8a6228 100%)`,
              }}
              animate={open ? { scale: 0.2, opacity: 0 } : { scale: 1, opacity: 1 }}
              transition={{ duration: reduce ? 0.08 : 0.38 }}
            >
              <span className="font-display text-lg italic text-[#2a0a0d] opacity-90">D</span>
            </motion.div>
          </button>
        </div>
        <p className="mt-5 text-center text-xs font-medium tracking-wide opacity-85" style={{ color: tokens.textMuted }}>
          Mühre dokunarak açın — davetiye süzülerek gelir
        </p>
      </div>
    </motion.div>
  );
}

export const InvitationPreview = forwardRef<InvitationPreviewHandle, InvitationPreviewProps>(
  function InvitationPreview(
    {
      namesDisplay,
      eyebrow,
      invitationLine,
      dateLine,
      eventAt,
      story,
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
    }: InvitationPreviewProps,
    ref,
  ) {
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

  useImperativeHandle(
    ref,
    () => ({
      scrollToSlide: (index: number, behavior: ScrollBehavior = "smooth") => {
        const el = scrollRef.current;
        if (!el) return;
        const page = Math.max(0, Math.min(SCROLL_SLIDE_MAX, index));
        const h = el.clientHeight;
        if (h < 1) return;
        el.scrollTo({ top: page * h, behavior });
      },
    }),
    [],
  );

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
      : "w-full min-h-[100dvh]";
  const innerMin =
    variant === "embedded" ? "min-h-full" : "min-h-[100dvh]";

  const rootClass =
    variant === "fullscreen"
      ? "relative isolate min-h-[100dvh] w-full max-w-[100vw] overflow-x-hidden text-[color:var(--inv-fg)]"
      : "relative isolate flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden text-[color:var(--inv-fg)]";

  const scrollWrapClass = cn(
    "davetio-invite-scroll davetio-scrollbar-hide snap-y snap-mandatory overflow-y-auto overflow-x-hidden",
    variant === "fullscreen"
      ? "h-[100dvh] max-h-[100dvh]"
      : "min-h-0 min-w-0 flex-1 basis-0",
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
      ? "font-sans text-[clamp(1.45rem,5.5vw,2.75rem)] font-medium tracking-tight md:text-[clamp(1.65rem,6.5vw,2.75rem)]"
      : "font-display text-[clamp(1.55rem,6vw,3rem)] font-normal italic md:text-[clamp(1.85rem,7vw,3rem)]";

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
          {[0, 1, 2, 3, 4, 5].map((i) => (
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
                "mt-10 max-w-[min(100%,22rem)] text-[clamp(1.08rem,3.8vw,1.4rem)] leading-snug sm:text-xl",
                tok.id === "nikah" ? "font-sans font-normal" : "font-display font-normal italic",
              )}
              style={{ color: "#6b1d2e" }}
            >
              {invitationLine}
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
          className="justify-center px-4 py-10 sm:px-6"
          tokens={tok}
        >
          <div className="mx-auto flex w-full max-w-lg flex-col items-center px-2 text-center">
            <h2 className="font-display text-xl font-semibold italic sm:text-2xl" style={{ color: tok.textPrimary }}>
              Hikayemiz ve Geri Sayım
            </h2>
            <p
              className="mt-6 max-w-md whitespace-pre-line text-sm leading-relaxed sm:text-base"
              style={{ color: tok.textMuted }}
            >
              {story.trim() ? story : invitationLine}
            </p>
            <p
              className="mt-10 text-[0.6rem] font-semibold uppercase tracking-[0.26em] opacity-80"
              style={{ color: tok.textMuted }}
            >
              Geri sayım
            </p>
            <div className="mt-5 grid w-full grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
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
        </Slide>

        <Slide
          sectionMinClass={sectionMin}
          innerMinClass={innerMin}
          className="justify-start px-4 py-8 sm:px-6"
          tokens={tok}
        >
          <div className="mx-auto w-full max-w-lg space-y-6 pb-[env(safe-area-inset-bottom)] pt-4">
            <FerforjeGateIllustration color={tok.textPrimary} />
            <div className="text-center">
              <div className="inline-flex items-center justify-center gap-2" style={{ color: tok.accent }}>
                <MapPin className="size-3.5" aria-hidden />
                <span
                  className="text-[0.6rem] font-semibold uppercase tracking-[0.22em] opacity-85"
                  style={{ color: tok.textMuted }}
                >
                  {tok.id === "nikah" ? "Tören yeri" : "Mekân"}
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
              className="davetio-invite-map w-full max-w-full overflow-hidden rounded-2xl shadow-[0_14px_40px_-24px_rgba(0,0,0,0.18)]"
              style={{ borderWidth: 1, borderColor: tok.borderSubtle }}
            >
              <iframe
                title="Mekân haritası"
                src={mapEmbedUrl}
                className="aspect-[16/10] min-h-[180px] w-full max-w-full sm:min-h-[220px] md:h-[240px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              {calendarUrl ? (
                <a
                  href={calendarUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex flex-1 items-center justify-center rounded-full px-6 py-3.5 text-center text-sm font-semibold text-white shadow-[0_12px_32px_-14px_rgba(107,29,46,0.45)] transition hover:opacity-95 sm:flex-none"
                  style={{ backgroundColor: "#6b1d2e" }}
                >
                  Takvime Kaydet
                </a>
              ) : null}
              <a
                href={mapsOpenUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex flex-1 items-center justify-center rounded-full border-2 border-[#6b1d2e] bg-white/90 px-6 py-3.5 text-center text-sm font-semibold text-[#6b1d2e] shadow-[0_10px_28px_-16px_rgba(74,20,32,0.18)] transition hover:bg-[#faf6f4] sm:flex-none"
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
            className={cn(
              "mx-auto flex w-full max-w-md flex-col gap-12 overflow-y-auto overflow-x-hidden pb-[env(safe-area-inset-bottom)] pt-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
              innerMin,
            )}
          >
            <div>
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
                    className="w-full rounded-xl border px-3 py-3 text-base outline-none"
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
                    Katılacak mısın?
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

            <div className="min-h-0 flex-1">
              <h2 className="text-center font-display text-xl font-semibold sm:text-2xl" style={{ color: tok.textPrimary }}>
                Anı Bırakın
              </h2>
              <p className="mt-3 text-center text-xs leading-relaxed sm:text-sm" style={{ color: tok.textMuted }}>
                Fotoğraf, kısa video veya ses ile bu güne eşlik edin.
              </p>
              <input ref={fileInputRef} type="file" accept="image/*,video/*,audio/*" className="sr-only" multiple />
              <div
                className="relative mx-auto mt-8 max-w-md rounded-[1.35rem] p-[3px] shadow-[0_20px_50px_-28px_rgba(74,20,32,0.2)]"
                style={{
                  background: `linear-gradient(135deg, #dfc896, #c9a44a 45%, #a67c2d)`,
                }}
              >
                <div className="rounded-[1.2rem] px-2 py-2" style={{ backgroundColor: tok.cardBg }}>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex min-h-[100px] w-full items-center justify-center rounded-xl border border-dashed border-[#c9a44a]/55 bg-white/75 px-6 py-8 font-display text-base font-medium transition hover:bg-white/95"
                    style={{ color: tok.textPrimary }}
                  >
                    Yükle
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Slide>

        <Slide
          sectionMinClass={sectionMin}
          innerMinClass={innerMin}
          className="justify-center px-5 py-14"
          tokens={tok}
        >
          <div
            className="mx-auto flex w-full max-w-md flex-col items-center rounded-sm px-6 py-12 text-center"
            style={{
              boxShadow: `inset 0 0 0 2px #6b1d2e, 0 24px 60px -34px rgba(74,20,32,0.25)`,
            }}
          >
            <p
              className="font-display text-2xl font-normal italic sm:text-3xl"
              style={{ color: "#6b1d2e" }}
            >
              Teşekkürler
            </p>
            <p
              className="mt-8 font-accent text-[clamp(1.35rem,5vw,2rem)] leading-tight"
              style={{ color: tok.textPrimary }}
            >
              {namesDisplay}
            </p>
            <p
              className="mt-6 max-w-sm font-display text-sm italic leading-relaxed sm:text-base"
              style={{ color: tok.textSecondary }}
            >
              Bu özel günde yanımızda olduğunuz için minnettarız.
            </p>
            {templateFooter ? (
              <p className="mt-8 text-[0.65rem]" style={{ color: tok.textMuted }}>
                {templateFooter}
              </p>
            ) : null}
            <p
              className="mt-12 text-[0.68rem] font-semibold uppercase tracking-[0.42em] text-[#6b1d2e]/75"
            >
              DAVETIO.NET
            </p>
          </div>
        </Slide>
      </div>

      <AnimatePresence>
        {!unlocked ? (
          <motion.div
            key="env"
            className={cn(
              "absolute inset-0 z-[70] flex flex-col overflow-x-hidden",
              variant === "fullscreen"
                ? "min-h-[100dvh]"
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
            <EnvelopeIntro
              tokens={tok}
              onOpen={openEnvelope}
              reduce={Boolean(reduce)}
              namesDisplay={namesDisplay}
              invitationLine={invitationLine}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
},
);

InvitationPreview.displayName = "InvitationPreview";
