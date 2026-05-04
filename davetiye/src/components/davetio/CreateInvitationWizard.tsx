"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Check,
  ChevronRight,
  Loader2,
  Diamond,
  Heart,
  Landmark,
  MapPin,
  Music,
  Pause,
  Phone,
  Play,
  Sparkles,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { resolveInviteVideoUrl } from "@/lib/invite-ambient-video";
import { getTemplatePreviewDemo } from "@/lib/template-preview-demo";
import { resolveTemplateHeroImage } from "@/lib/template-preview-images";
import { HeroFlyingHearts } from "@/components/landing/HeroFlyingHearts";
import { InvitationPreviewStage } from "@/components/davetio/InvitationPreviewStage";
import {
  loadRsvpGuests,
  saveInvitationDraft,
  type SavedInvitationDraft,
} from "@/lib/davetio-invitation-storage";

function formatStepDateTime(dateIso: string, time: string, locale: string): string | null {
  if (!dateIso) return null;
  const tPart = time && time.length >= 4 ? time : "12:00";
  const d = new Date(`${dateIso}T${tPart}`);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleString(locale === "de" ? "de-DE" : "tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type MusicTrack = {
  id: string;
  title: string;
  sub: string;
  recommended: boolean;
};

const AUDIO: Record<string, string> = Object.fromEntries(
  Array.from({ length: 6 }, (_, i) => {
    const n = i + 1;
    return [
      `t${n}`,
      `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${n}.mp3`,
    ] as const;
  }),
);

type Props = {
  templateSlug?: string | null;
  pkg?: string | null;
};

const FORM_START = 4;
const REVIEW_STEP = 7;
const PAYMENT_STEP = 8;
const TOTAL_STEPS = 9;

type EventKind = "wedding" | "nikah" | "henna" | "engagement";

export function CreateInvitationWizard({ templateSlug, pkg }: Props) {
  const t = useTranslations("CreateFlow");
  const tModal = useTranslations("Landing.previewModal");
  const tLand = useTranslations("Landing");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tracks = t.raw("musicTracks") as MusicTrack[];
  const flowTitles = t.raw("flowStepTitles") as string[];

  const [flowStep, setFlowStep] = useState(0);
  const [eventType, setEventType] = useState<EventKind | null>(null);
  const [selectedPkg, setSelectedPkg] = useState<string | null>(pkg ?? null);
  const [pickedTemplate, setPickedTemplate] = useState(templateSlug ?? "");
  const [templateDemoSlug, setTemplateDemoSlug] = useState<string | null>(null);

  const [done] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [savingDraft, setSavingDraft] = useState(false);
  const [cloud, setCloud] = useState<{
    token: string;
    panelUrl: string;
    whatsappUrl: string | null;
  } | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutFirstName, setCheckoutFirstName] = useState("");
  const [checkoutLastName, setCheckoutLastName] = useState("");
  const [checkoutEmail, setCheckoutEmail] = useState("");
  const [checkoutPhone, setCheckoutPhone] = useState("");
  const [checkoutAddress, setCheckoutAddress] = useState("");
  const [checkoutCity, setCheckoutCity] = useState("");
  const [checkoutCountry, setCheckoutCountry] = useState("TR");
  const [checkoutPostcode, setCheckoutPostcode] = useState("");

  const [bride, setBride] = useState("");
  const [groom, setGroom] = useState("");
  const [bm, setBm] = useState("");
  const [bf, setBf] = useState("");
  const [gm, setGm] = useState("");
  const [gf, setGf] = useState("");

  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [venueName, setVenueName] = useState("");
  const [venueAddress, setVenueAddress] = useState("");
  const [mapsLink, setMapsLink] = useState("");
  const [phone, setPhone] = useState("");

  const [selectedTrack, setSelectedTrack] = useState<string>(tracks[0]?.id ?? "t1");
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const meta = useMemo(() => {
    const parts: string[] = [];
    if (pickedTemplate) parts.push(pickedTemplate);
    if (selectedPkg) parts.push(selectedPkg);
    return parts.join(" · ") || "—";
  }, [pickedTemplate, selectedPkg]);

  const allTemplateItems = tLand.raw("templates.items") as {
    slug: string;
    filterId: string;
    name: string;
    image: string;
    imageAlt: string;
  }[];

  const filteredTemplateItems = useMemo(() => {
    if (!eventType) return allTemplateItems;
    const map: Record<EventKind, string> = {
      wedding: "wedding",
      nikah: "nikah",
      henna: "henna",
      engagement: "engagement",
    };
    const fid = map[eventType];
    const list = allTemplateItems.filter((x) => x.filterId === fid);
    return list.length > 0 ? list : allTemplateItems;
  }, [allTemplateItems, eventType]);

  const effectiveTemplateSlug = pickedTemplate || templateSlug || "serenade-hall";

  const activeTemplateFilterId = useMemo(
    () => allTemplateItems.find((x) => x.slug === effectiveTemplateSlug)?.filterId,
    [allTemplateItems, effectiveTemplateSlug],
  );

  const displayWhen = useMemo(() => {
    return formatStepDateTime(eventDate, eventTime, locale) ?? t("exampleDateLabel");
  }, [eventDate, eventTime, locale, t]);

  const videoSrc = useMemo(
    () => resolveInviteVideoUrl({ messageFallback: tModal("videoSrc") }),
    [tModal],
  );

  const brideLive = useMemo(
    () => (bride.trim() ? bride.trim() : t("exampleBride")),
    [bride, t],
  );
  const groomLive = useMemo(
    () => (groom.trim() ? groom.trim() : t("exampleGroom")),
    [groom, t],
  );

  const heroImageStudio = useMemo(
    () => resolveTemplateHeroImage(effectiveTemplateSlug, undefined),
    [effectiveTemplateSlug],
  );

  const demoTemplate = useMemo(
    () => allTemplateItems.find((x) => x.slug === templateDemoSlug) ?? null,
    [allTemplateItems, templateDemoSlug],
  );

  const studioPreviewDemo = useMemo(
    () => getTemplatePreviewDemo(effectiveTemplateSlug, locale),
    [effectiveTemplateSlug, locale],
  );

  const templateModalDemo = useMemo(
    () => (demoTemplate ? getTemplatePreviewDemo(demoTemplate.slug, locale) : null),
    [demoTemplate, locale],
  );

  const hydrated = useRef(false);
  useEffect(() => {
    if (hydrated.current) return;
    const tpl = searchParams.get("template");
    if (tpl) {
      setPickedTemplate(tpl);
      const pk = searchParams.get("pkg");
      if (pk) setSelectedPkg(pk);
      setFlowStep(FORM_START);
    }
    hydrated.current = true;
  }, [searchParams]);

  useEffect(() => {
    if (!templateDemoSlug) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setTemplateDemoSlug(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [templateDemoSlug]);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setPlayingId(null);
  }, []);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  async function togglePlay(id: string) {
    const url = AUDIO[id];
    if (!url) return;
    if (playingId === id) {
      stopAudio();
      return;
    }
    stopAudio();
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = "none";
    }
    audioRef.current.src = url;
    try {
      await audioRef.current.play();
      setPlayingId(id);
      audioRef.current.onended = () => setPlayingId(null);
    } catch {
      setPlayingId(null);
    }
  }

  function validateNames() {
    if (!bride.trim() || !groom.trim()) {
      setErr(t("required"));
      return false;
    }
    return true;
  }

  function validateVenue() {
    if (
      !eventDate ||
      !eventTime ||
      !venueName.trim() ||
      !venueAddress.trim() ||
      !phone.trim() ||
      phone.replace(/\D/g, "").length < 10
    ) {
      setErr(t("required"));
      return false;
    }
    return true;
  }

  function next() {
    setErr(null);
    if (flowStep === 0) {
      setFlowStep(1);
      return;
    }
    if (flowStep === 1) {
      if (!eventType) {
        setErr(t("onboardingPickEvent"));
        return;
      }
      setFlowStep(2);
      return;
    }
    if (flowStep === 2) {
      if (!selectedPkg) {
        setErr(t("onboardingPickBundle"));
        return;
      }
      setFlowStep(3);
      return;
    }
    if (flowStep === 3) {
      if (!pickedTemplate.trim()) {
        setErr(t("onboardingPickTemplate"));
        return;
      }
      const q = new URLSearchParams();
      q.set("template", pickedTemplate);
      if (selectedPkg) q.set("pkg", selectedPkg);
      router.replace(`${pathname}?${q.toString()}`, { scroll: false });
      setFlowStep(4);
      return;
    }
    if (flowStep === 4 && !validateNames()) return;
    if (flowStep === 5 && !validateVenue()) return;
    if (flowStep === 6) {
      setFlowStep(7);
      return;
    }
    if (flowStep < REVIEW_STEP) setFlowStep((s) => s + 1);
  }

  function prev() {
    setErr(null);
    stopAudio();
    setFlowStep((s) => Math.max(0, s - 1));
  }

  async function saveDraftAndCreatePanel() {
    setErr(null);
    stopAudio();
    const music = tracks.find((x) => x.id === selectedTrack);
    const draft: SavedInvitationDraft = {
      version: 1,
      savedAt: new Date().toISOString(),
      templateSlug: pickedTemplate || templateSlug || null,
      pkg: selectedPkg ?? pkg ?? null,
      bride: bride.trim(),
      groom: groom.trim(),
      brideMother: bm.trim(),
      brideFather: bf.trim(),
      groomMother: gm.trim(),
      groomFather: gf.trim(),
      eventDate,
      eventTime,
      venueName: venueName.trim(),
      venueAddress: venueAddress.trim(),
      mapsLink: mapsLink.trim(),
      phone: phone.trim(),
      musicTrackId: selectedTrack,
      musicTrackTitle: music?.title ?? "",
    };
    saveInvitationDraft(draft);

    setCloud(null);
    try {
      const res = await fetch("/api/panel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          draft,
          rsvpGuests: loadRsvpGuests(),
        }),
      });
      if (res.ok) {
        const data = (await res.json()) as {
          token: string;
          panelUrl: string;
          whatsappUrl: string | null;
        };
        setCloud({
          token: data.token,
          panelUrl: data.panelUrl,
          whatsappUrl: data.whatsappUrl,
        });
      }
    } catch {
      /* Supabase yok veya ağ hatası — yalnızca yerel kayıt */
    }
    return true;
  }

  async function preparePaymentStep() {
    setSavingDraft(true);
    try {
      const ok = await saveDraftAndCreatePanel();
      if (ok) {
        setCheckoutFirstName((prev) => prev || bride.trim() || t("paymentFallbackFirstName"));
        setCheckoutLastName((prev) => prev || groom.trim() || t("paymentFallbackLastName"));
        setCheckoutPhone((prev) => prev || `90${phone.replace(/\D/g, "")}`);
        setFlowStep(PAYMENT_STEP);
      }
    } finally {
      setSavingDraft(false);
    }
  }

  async function submitCheckout() {
    if (!selectedPkg) {
      setErr(t("onboardingPickBundle"));
      return;
    }
    setCheckoutLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/shopier/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "text/html, application/json" },
        body: JSON.stringify({
          packageId: selectedPkg,
          locale,
          buyer: {
            firstName: checkoutFirstName.trim(),
            lastName: checkoutLastName.trim(),
            email: checkoutEmail.trim(),
            phone: checkoutPhone.replace(/\s/g, ""),
          },
          billing: {
            address: checkoutAddress.trim(),
            city: checkoutCity.trim(),
            country: checkoutCountry.trim(),
            postcode: checkoutPostcode.trim(),
          },
        }),
      });

      const bodyText = await res.text();

      if (!res.ok) {
        try {
          const j = JSON.parse(bodyText) as { error?: string };
          setErr(j.error ?? t("paymentError"));
        } catch {
          setErr(t("paymentError"));
        }
        setCheckoutLoading(false);
        return;
      }

      document.open();
      document.write(bodyText);
      document.close();
    } catch {
      setErr(t("paymentError"));
      setCheckoutLoading(false);
    }
  }

  const selectedTrackObj = tracks.find((x) => x.id === selectedTrack);

  const progressPct = useMemo(
    () => (done ? 100 : Math.round(((flowStep + 1) / TOTAL_STEPS) * 100)),
    [done, flowStep],
  );

  const flowSubtitle = flowTitles[flowStep] ?? "";

  return (
    <div
      className={`relative min-h-[100dvh] bg-gradient-to-b from-canvas via-[#faf9f7] to-canvas-muted ${done ? "" : "pb-28"}`}
    >
      <header className="sticky top-0 z-40 border-b border-ink/[0.06] bg-canvas/93 pt-[env(safe-area-inset-top,0px)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-xl min-w-0 items-center justify-between gap-2 px-3 py-2.5 sm:gap-3 sm:px-6 sm:py-3">
          <Link
            href="/"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-brand transition-colors hover:text-brand-hover sm:gap-2"
          >
            <ArrowLeft className="size-4 shrink-0" aria-hidden />
            <span className="hidden sm:inline">{t("backHome")}</span>
          </Link>
          <span className="line-clamp-2 min-w-0 flex-1 px-1 text-center font-display text-xs font-semibold leading-tight tracking-tight text-ink sm:text-sm">
            {t("studioLabel")}
          </span>
          <span className="shrink-0 min-w-[2.75rem] text-right text-xs font-bold tabular-nums text-brand">{progressPct}%</span>
        </div>
        <div className="h-[3px] bg-ink/10">
          <div
            className="h-full bg-gradient-to-r from-brand via-wine to-soft-gold transition-[width] duration-500 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </header>

      <div className="mx-auto max-w-xl px-3 pb-10 pt-4 sm:px-6 sm:pb-14 sm:pt-6">
      <div className="overflow-hidden rounded-[1.35rem] border border-ink/[0.08] bg-white shadow-[0_24px_70px_-36px_rgba(22,24,20,0.22)] ring-1 ring-white/70 sm:rounded-[2rem]">
        <div className="border-b border-ink/[0.06] bg-canvas-muted/80 px-4 py-4 sm:px-6 sm:py-5">
          <p className="text-center text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted">
            {t("flowProgress", { current: Math.min(flowStep + 1, TOTAL_STEPS), total: TOTAL_STEPS })}
          </p>
          <p className="mt-2 text-center font-display text-xl font-semibold leading-snug text-ink sm:text-2xl">
            {flowSubtitle}
          </p>
          <p className="sr-only">{t("title")}</p>
          <div className="mt-4 flex gap-1">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-all duration-300",
                  i <= flowStep ? "bg-wine" : "bg-ink/10",
                )}
              />
            ))}
          </div>
        </div>

        <div className="p-4 sm:p-8">
          {flowStep >= FORM_START ? (
            <>
              <h1 className="font-display text-2xl font-semibold text-ink">{t("title")}</h1>
              <p className="mt-2 text-sm text-muted">{t("hint")}</p>
              <p className="mt-1 text-xs text-muted">
                {t("templateLabel")}: <span className="font-mono text-ink">{meta}</span>
              </p>
            </>
          ) : (
            <>
              <p className="text-sm leading-relaxed text-muted">{t("hintLong")}</p>
            </>
          )}

          {err ? (
            <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
              {err}
            </p>
          ) : null}

          {!done && flowStep === 0 ? (
            <div className="relative mt-8 overflow-hidden rounded-2xl border border-white/40 davetio-hero-section px-5 py-12 text-center shadow-inner">
              <HeroFlyingHearts subtle tone="blush" />
              <div className="relative z-[2]">
                <p className="font-display text-2xl font-semibold leading-tight text-ink sm:text-3xl">{t("welcomeTitle")}</p>
                <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-muted">{t("welcomeSubtitle")}</p>
              </div>
            </div>
          ) : null}

          {!done && flowStep === 1 ? (
            <div className="mt-8 space-y-5">
              <div className="text-center">
                <p className="font-display text-lg font-semibold text-ink">{t("eventTitle")}</p>
                <p className="mt-1 text-sm text-muted">{t("eventSubtitle")}</p>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {(
                  [
                    { id: "wedding" as const, Icon: Heart, lab: "eventWedding", desc: "eventWeddingDesc" },
                    { id: "nikah" as const, Icon: Landmark, lab: "eventNikah", desc: "eventNikahDesc" },
                    { id: "henna" as const, Icon: Sparkles, lab: "eventHenna", desc: "eventHennaDesc" },
                    { id: "engagement" as const, Icon: Diamond, lab: "eventEngagement", desc: "eventEngagementDesc" },
                  ] as const
                ).map(({ id, Icon, lab, desc }) => {
                  const sel = eventType === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setEventType(id)}
                      className={cn(
                        "relative flex flex-col items-start gap-3 rounded-2xl border bg-white p-4 text-left transition-all duration-300",
                        sel
                          ? "border-accent-rose shadow-[0_0_0_1px_rgba(178,74,92,0.35)] ring-2 ring-accent-rose/25"
                          : "border-ink/[0.08] hover:border-ink/18",
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-11 items-center justify-center rounded-full",
                          sel ? "bg-accent-rose text-white" : "bg-canvas-muted text-muted",
                        )}
                      >
                        <Icon className="size-5" strokeWidth={1.75} aria-hidden />
                      </span>
                      <span>
                        <span className="block font-display text-base font-semibold text-ink">{t(lab)}</span>
                        <span className="mt-1 block text-[0.78rem] leading-snug text-muted">{t(desc)}</span>
                      </span>
                      {sel ? (
                        <Check className="absolute right-4 top-4 size-5 text-accent-rose sm:right-5 sm:top-5" aria-hidden />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          {!done && flowStep === 2 ? (
            <div className="mt-8 space-y-5">
              <div className="text-center">
                <p className="font-display text-lg font-semibold text-ink">{t("bundleTitle")}</p>
                <p className="mt-1 text-sm text-muted">{t("bundleSubtitle")}</p>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {(
                  [
                    { id: "pkg_solo_wedding", label: "bundleSoloWedding", price: "bundleSoloWeddingPrice" },
                    { id: "pkg_wedding_nikah", label: "bundleWeddingNikah", price: "bundleWeddingNikahPrice" },
                    { id: "pkg_wedding_henna", label: "bundleWeddingHenna", price: "bundleWeddingHennaPrice" },
                    { id: "pkg_solo_engagement", label: "bundleSoloEngagement", price: "bundleSoloEngagementPrice" },
                    { id: "pkg_solo_nikah", label: "bundleSoloNikah", price: "bundleSoloNikahPrice" },
                    { id: "pkg_solo_henna", label: "bundleSoloHenna", price: "bundleSoloHennaPrice" },
                  ] as const
                ).map(({ id, label, price }) => {
                  const sel = selectedPkg === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setSelectedPkg(id)}
                      className={cn(
                        "relative flex flex-col rounded-2xl border bg-white p-4 text-left transition-all duration-300",
                        sel
                          ? "border-accent-rose shadow-[0_0_0_1px_rgba(178,74,92,0.35)] ring-2 ring-accent-rose/25"
                          : "border-ink/[0.08] hover:border-ink/18",
                      )}
                    >
                      {sel ? (
                        <span className="absolute right-3 top-3 flex size-6 items-center justify-center rounded-full bg-accent-rose text-white">
                          <Check className="size-3.5" aria-hidden />
                        </span>
                      ) : null}
                      <span className="font-display text-[0.95rem] font-semibold text-ink">{t(label)}</span>
                      <span className="mt-2 text-sm font-bold tabular-nums text-muted">{t(price)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          {!done && flowStep === 3 ? (
            <div className="mt-8 space-y-5">
              <div className="text-center">
                <p className="font-display text-lg font-semibold text-ink">{t("templatePickTitle")}</p>
                <p className="mt-1 text-sm text-muted">{t("templatePickSubtitle")}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {filteredTemplateItems.map((item) => {
                  const sel = pickedTemplate === item.slug;
                  return (
                    <div key={item.slug} className="relative">
                      <button
                        type="button"
                        onClick={() => setPickedTemplate(item.slug)}
                        className={cn(
                          "w-full overflow-hidden rounded-2xl border bg-white text-left transition-all duration-300",
                          sel
                            ? "border-accent-rose shadow-[0_0_0_1px_rgba(178,74,92,0.35)] ring-2 ring-accent-rose/25"
                            : "border-ink/[0.08] hover:border-ink/18",
                        )}
                      >
                        <div className="relative aspect-square bg-canvas-muted">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={resolveTemplateHeroImage(item.slug, item.image)}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                          {sel ? (
                            <span className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-accent-rose text-white shadow-md">
                              <Check className="size-4" aria-hidden />
                            </span>
                          ) : null}
                        </div>
                        <p className="line-clamp-2 px-2 py-2 text-[0.68rem] font-semibold leading-snug text-ink">{item.name}</p>
                      </button>
                      <button
                        type="button"
                        onClick={() => setTemplateDemoSlug(item.slug)}
                        className="mt-1.5 w-full rounded-xl border border-accent-rose/25 bg-accent-rose-muted/40 py-1.5 text-[0.62rem] font-bold uppercase tracking-wide text-accent-rose transition-colors hover:bg-accent-rose-muted"
                      >
                        {t("templateDemo")}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}

          {!done && flowStep >= FORM_START ? (
            <div className="mt-6 space-y-3">
              <div className="text-center">
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-wine">
                  {t("livePreviewTitle")}
                </p>
                <p className="mt-1.5 text-[0.7rem] leading-snug text-muted">{t("studioPreviewHint")}</p>
              </div>
              <InvitationPreviewStage
                variant="studio"
                theme={activeTemplateFilterId}
                showTemplateFooter={false}
                videoSrc={videoSrc}
                previewEyebrow={t("previewEyebrow")}
                previewNames={`${brideLive} & ${groomLive}`}
                coupleFirstName={brideLive}
                coupleSecondName={groomLive}
                previewTagline={t("previewTagline")}
                previewDate={displayWhen ?? t("exampleDateLabel")}
                previewVenue={
                  (venueName.trim() || t("exampleVenue")) +
                  " · " +
                  (venueAddress.trim() || t("exampleAddress")).replace(/\n/g, ", ")
                }
                previewMapsCta={mapsLink.trim() ? `${t("mapsPreviewCta")} ✓` : t("mapsPreviewCta")}
                mapEmbedUrl={studioPreviewDemo.mapEmbedUrl}
                mapsOpenUrl={mapsLink.trim() || studioPreviewDemo.mapsOpenUrl}
                templateName={meta}
                heroImage={heroImageStudio}
              />
            </div>
          ) : null}

          {done ? (
            <div className="mt-8 space-y-4 rounded-2xl border border-brand/15 bg-canvas-muted/60 p-5">
              <p className="font-display text-lg font-semibold text-brand">
                {cloud ? t("successTitleCloud") : t("successTitle")}
              </p>
              <p className="text-sm leading-relaxed text-muted">
                {cloud ? t("successBodyCloud") : t("successBody")}
              </p>
              {cloud ? (
                <div className="space-y-3 rounded-xl border border-ink/10 bg-white/90 p-4">
                  <p className="text-[0.65rem] font-bold uppercase tracking-wide text-muted">
                    {t("successPanelUrlLabel")}
                  </p>
                  <p className="break-all font-mono text-xs text-ink/90">{cloud.panelUrl}</p>
                  <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                    <Link
                      href={`/panel/${cloud.token}`}
                      className="inline-flex items-center justify-center gap-1 rounded-2xl bg-brand px-4 py-2.5 text-sm font-bold text-white shadow-md transition-colors hover:bg-brand-hover"
                    >
                      {t("successCtaPanel")}
                    </Link>
                    {cloud.whatsappUrl ? (
                      <a
                        href={cloud.whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1 rounded-2xl border border-emerald-600/30 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-900 transition-colors hover:bg-emerald-100"
                      >
                        {t("successWhatsApp")}
                      </a>
                    ) : null}
                    <Link
                      href="/"
                      className="inline-flex items-center justify-center gap-1 rounded-2xl border border-ink/15 bg-white px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-brand/30 hover:text-brand"
                    >
                      ← {t("backHome")}
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                  <Link
                    href="/panel"
                    className="inline-flex items-center justify-center gap-1 rounded-2xl bg-brand px-4 py-2.5 text-sm font-bold text-white shadow-md transition-colors hover:bg-brand-hover"
                  >
                    {t("successCtaPanel")}
                  </Link>
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center gap-1 rounded-2xl border border-ink/15 bg-white px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-brand/30 hover:text-brand"
                  >
                    ← {t("backHome")}
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <>
              {flowStep === 4 ? (
                <div className="mt-8 space-y-8">
                  <p className="text-center text-[0.65rem] font-bold uppercase tracking-[0.2em] text-wine">
                    {t("stepNamesTitle")}
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="text-sm font-semibold text-ink">
                      {t("bride")} *
                      <input
                        value={bride}
                        onChange={(e) => setBride(e.target.value)}
                        placeholder={t("exampleBride")}
                        className="mt-1.5 w-full rounded-xl border border-ink/10 bg-canvas px-3 py-2.5 text-sm outline-none ring-wine/20 focus:ring-2"
                      />
                    </label>
                    <label className="text-sm font-semibold text-ink">
                      {t("groom")} *
                      <input
                        value={groom}
                        onChange={(e) => setGroom(e.target.value)}
                        placeholder={t("exampleGroom")}
                        className="mt-1.5 w-full rounded-xl border border-ink/10 bg-canvas px-3 py-2.5 text-sm outline-none ring-wine/20 focus:ring-2"
                      />
                    </label>
                  </div>
                  <div>
                    <p className="border-b border-ink/10 pb-2 text-center text-[0.65rem] font-bold uppercase tracking-[0.2em] text-muted">
                      {t("sectionBride")}
                    </p>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <label className="text-sm text-ink">
                        {t("brideMother")}
                        <input
                          value={bm}
                          onChange={(e) => setBm(e.target.value)}
                          className="mt-1.5 w-full rounded-xl border border-ink/10 bg-canvas px-3 py-2.5 text-sm outline-none ring-wine/20 focus:ring-2"
                        />
                      </label>
                      <label className="text-sm text-ink">
                        {t("brideFather")}
                        <input
                          value={bf}
                          onChange={(e) => setBf(e.target.value)}
                          className="mt-1.5 w-full rounded-xl border border-ink/10 bg-canvas px-3 py-2.5 text-sm outline-none ring-wine/20 focus:ring-2"
                        />
                      </label>
                    </div>
                    <p className="mt-1 text-xs text-muted">{t("nameHint")}</p>
                  </div>
                  <div>
                    <p className="border-b border-ink/10 pb-2 text-center text-[0.65rem] font-bold uppercase tracking-[0.2em] text-muted">
                      {t("sectionGroom")}
                    </p>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <label className="text-sm text-ink">
                        {t("groomMother")}
                        <input
                          value={gm}
                          onChange={(e) => setGm(e.target.value)}
                          className="mt-1.5 w-full rounded-xl border border-ink/10 bg-canvas px-3 py-2.5 text-sm outline-none ring-wine/20 focus:ring-2"
                        />
                      </label>
                      <label className="text-sm text-ink">
                        {t("groomFather")}
                        <input
                          value={gf}
                          onChange={(e) => setGf(e.target.value)}
                          className="mt-1.5 w-full rounded-xl border border-ink/10 bg-canvas px-3 py-2.5 text-sm outline-none ring-wine/20 focus:ring-2"
                        />
                      </label>
                    </div>
                    <p className="mt-1 text-xs text-muted">{t("nameHint")}</p>
                  </div>
                </div>
              ) : null}

              {flowStep === 5 ? (
                <div className="mt-8 space-y-6">
                  <div className="flex items-center gap-2 text-wine">
                    <Calendar className="size-5" strokeWidth={1.75} />
                    <span className="text-sm font-bold text-ink">{t("stepVenueTitle")}</span>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="text-sm font-semibold text-ink">
                      {t("date")} *
                      <input
                        type="date"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-ink/10 bg-canvas px-3 py-2.5 text-sm outline-none ring-wine/20 focus:ring-2"
                      />
                    </label>
                    <label className="text-sm font-semibold text-ink">
                      {t("time")} *
                      <input
                        type="time"
                        value={eventTime}
                        onChange={(e) => setEventTime(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-ink/10 bg-canvas px-3 py-2.5 text-sm outline-none ring-wine/20 focus:ring-2"
                      />
                    </label>
                  </div>
                  <div className="flex items-center gap-2 text-wine">
                    <MapPin className="size-5" strokeWidth={1.75} />
                    <span className="text-sm font-bold text-ink">{t("venueBlockTitle")}</span>
                  </div>
                  <label className="block text-sm font-semibold text-ink">
                    {t("venueName")} *
                    <input
                      value={venueName}
                      onChange={(e) => setVenueName(e.target.value)}
                      placeholder={t("phVenueName")}
                      className="mt-1.5 w-full rounded-xl border border-ink/10 bg-canvas px-3 py-2.5 text-sm outline-none ring-wine/20 focus:ring-2"
                    />
                  </label>
                  <label className="block text-sm font-semibold text-ink">
                    {t("venueAddress")} *
                    <textarea
                      value={venueAddress}
                      onChange={(e) => setVenueAddress(e.target.value)}
                      rows={3}
                      placeholder={t("phVenueAddress")}
                      className="mt-1.5 w-full resize-none rounded-xl border border-ink/10 bg-canvas px-3 py-2.5 text-sm outline-none ring-wine/20 focus:ring-2"
                    />
                  </label>
                  <label className="block text-sm font-semibold text-ink">
                    {t("mapsLink")}
                    <input
                      value={mapsLink}
                      onChange={(e) => setMapsLink(e.target.value)}
                      placeholder={t("phMapsLink")}
                      className="mt-1.5 w-full rounded-xl border border-ink/10 bg-canvas px-3 py-2.5 text-sm outline-none ring-wine/20 focus:ring-2"
                    />
                  </label>
                  <div className="flex items-start gap-2 text-wine">
                    <Phone className="mt-0.5 size-5 shrink-0" strokeWidth={1.75} />
                    <div className="flex-1">
                      <span className="text-sm font-bold text-ink">{t("phone")} *</span>
                      <div className="mt-1.5 flex gap-2">
                        <span className="flex shrink-0 items-center rounded-xl border border-ink/10 bg-canvas px-3 py-2.5 text-xs font-semibold text-muted">
                          {t("phonePrefix")}
                        </span>
                        <input
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          inputMode="tel"
                          autoComplete="tel"
                          placeholder={t("phPhone")}
                          className="min-w-0 flex-1 rounded-xl border border-ink/10 bg-canvas px-3 py-2.5 text-sm outline-none ring-wine/20 focus:ring-2"
                        />
                      </div>
                      <p className="mt-1.5 text-xs italic text-muted">{t("phoneHint")}</p>
                    </div>
                  </div>
                </div>
              ) : null}

              {flowStep === 6 ? (
                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-2 text-wine">
                    <Music className="size-5" strokeWidth={1.75} />
                    <span className="text-sm font-bold text-ink">{t("stepMusicTitle")}</span>
                  </div>
                  <p className="text-xs text-muted">{t("musicHint")}</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {tracks.map((trk) => {
                      const active = selectedTrack === trk.id;
                      const playing = playingId === trk.id;
                      return (
                        <div
                          key={trk.id}
                          role="button"
                          tabIndex={0}
                          onClick={() => setSelectedTrack(trk.id)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              setSelectedTrack(trk.id);
                            }
                          }}
                          className={cn(
                            "relative flex cursor-pointer gap-3 rounded-2xl border bg-white p-3 text-left transition-all duration-200",
                            active
                              ? "border-wine ring-2 ring-wine/20"
                              : "border-ink/10 hover:border-wine/35",
                          )}
                        >
                          {trk.recommended ? (
                            <span className="absolute right-2 top-2 rounded bg-soft-gold px-1.5 py-0.5 text-[0.55rem] font-bold uppercase text-ink">
                              {t("recommended")}
                            </span>
                          ) : null}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              void togglePlay(trk.id);
                            }}
                            className="flex size-11 shrink-0 items-center justify-center rounded-full border border-ink/10 bg-canvas text-wine transition-transform hover:scale-105"
                            aria-label="play"
                          >
                            {playing ? (
                              <Pause className="size-5" fill="currentColor" />
                            ) : (
                              <Play className="size-5 pl-0.5" fill="currentColor" />
                            )}
                          </button>
                          <div className="min-w-0 flex-1 pt-0.5">
                            <p className="text-[0.8rem] font-semibold leading-snug text-ink">
                              {trk.title}
                            </p>
                            <p className="text-[0.65rem] uppercase tracking-wide text-muted">
                              {trk.sub}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              {flowStep === REVIEW_STEP ? (
                <div className="mt-8 space-y-4 text-sm pb-2">
                  <p className="font-display text-lg font-semibold text-ink">{t("stepReviewTitle")}</p>
                  <div className="rounded-2xl border border-ink/8 bg-canvas-muted/50 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-muted">
                      {t("reviewNames")}
                    </p>
                    <p className="mt-1 font-medium text-ink">
                      {bride} & {groom}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-ink/8 bg-canvas-muted/50 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-muted">
                      {t("reviewVenue")}
                    </p>
                    <p className="mt-1 text-ink">
                      {eventDate} {eventTime}
                    </p>
                    <p className="mt-1 font-medium text-ink">{venueName}</p>
                    <p className="mt-1 whitespace-pre-line text-muted">{venueAddress}</p>
                    {mapsLink ? (
                      <p className="mt-2 truncate text-xs text-brand">{mapsLink}</p>
                    ) : null}
                    <p className="mt-2 text-ink">
                      {t("phonePrefix")} {phone}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-ink/8 bg-canvas-muted/50 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-muted">
                      {t("reviewMusic")}
                    </p>
                    <p className="mt-1 font-medium text-ink">{selectedTrackObj?.title ?? t("none")}</p>
                  </div>
                </div>
              ) : null}

              {flowStep === PAYMENT_STEP ? (
                <div className="mt-8 space-y-5">
                  <div className="rounded-2xl border border-brand/15 bg-canvas-muted/55 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-muted">{t("paymentStepBadge")}</p>
                    <p className="mt-1 font-display text-lg font-semibold text-ink">{t("paymentStepTitle")}</p>
                    <p className="mt-1 text-sm text-muted">{t("paymentStepBody")}</p>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <label className="text-sm font-semibold text-ink">
                      {t("paymentFirstName")} *
                      <input
                        required
                        value={checkoutFirstName}
                        onChange={(e) => setCheckoutFirstName(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-ink/10 bg-canvas px-3 py-2.5 text-sm outline-none ring-wine/20 focus:ring-2"
                        autoComplete="given-name"
                      />
                    </label>
                    <label className="text-sm font-semibold text-ink">
                      {t("paymentLastName")} *
                      <input
                        required
                        value={checkoutLastName}
                        onChange={(e) => setCheckoutLastName(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-ink/10 bg-canvas px-3 py-2.5 text-sm outline-none ring-wine/20 focus:ring-2"
                        autoComplete="family-name"
                      />
                    </label>
                  </div>

                  <label className="block text-sm font-semibold text-ink">
                    {t("paymentEmail")} *
                    <input
                      required
                      type="email"
                      value={checkoutEmail}
                      onChange={(e) => setCheckoutEmail(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-ink/10 bg-canvas px-3 py-2.5 text-sm outline-none ring-wine/20 focus:ring-2"
                      autoComplete="email"
                    />
                  </label>

                  <label className="block text-sm font-semibold text-ink">
                    {t("paymentPhone")} *
                    <input
                      required
                      inputMode="tel"
                      value={checkoutPhone}
                      onChange={(e) => setCheckoutPhone(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-ink/10 bg-canvas px-3 py-2.5 text-sm outline-none ring-wine/20 focus:ring-2"
                      autoComplete="tel"
                    />
                  </label>

                  <label className="block text-sm font-semibold text-ink">
                    {t("paymentAddress")} *
                    <input
                      required
                      value={checkoutAddress}
                      onChange={(e) => setCheckoutAddress(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-ink/10 bg-canvas px-3 py-2.5 text-sm outline-none ring-wine/20 focus:ring-2"
                      autoComplete="street-address"
                    />
                  </label>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <label className="text-sm font-semibold text-ink">
                      {t("paymentCity")} *
                      <input
                        required
                        value={checkoutCity}
                        onChange={(e) => setCheckoutCity(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-ink/10 bg-canvas px-3 py-2.5 text-sm outline-none ring-wine/20 focus:ring-2"
                        autoComplete="address-level2"
                      />
                    </label>
                    <label className="text-sm font-semibold text-ink">
                      {t("paymentPostcode")} *
                      <input
                        required
                        value={checkoutPostcode}
                        onChange={(e) => setCheckoutPostcode(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-ink/10 bg-canvas px-3 py-2.5 text-sm outline-none ring-wine/20 focus:ring-2"
                        autoComplete="postal-code"
                      />
                    </label>
                  </div>

                  <label className="block text-sm font-semibold text-ink">
                    {t("paymentCountry")} *
                    <input
                      required
                      value={checkoutCountry}
                      onChange={(e) => setCheckoutCountry(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-ink/10 bg-canvas px-3 py-2.5 text-sm outline-none ring-wine/20 focus:ring-2"
                      autoComplete="country-name"
                    />
                  </label>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
      </div>

      {!done ? (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-ink/10 bg-canvas/95 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-14px_44px_-24px_rgba(22,24,20,0.14)] backdrop-blur-xl">
          <div className="mx-auto flex max-w-xl items-center justify-between gap-4 px-4 sm:px-6">
            <button
              type="button"
              onClick={prev}
              disabled={flowStep === 0}
              className="inline-flex min-h-11 items-center gap-1 rounded-2xl border border-ink/12 bg-white px-4 py-2.5 text-sm font-semibold text-ink shadow-sm transition-colors disabled:pointer-events-none disabled:opacity-35 hover:border-brand/30 hover:text-brand"
            >
              <ArrowLeft className="size-4" />
              {t("back")}
            </button>
            {flowStep < REVIEW_STEP ? (
              <button
                type="button"
                onClick={next}
                className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-wine to-wine-hover px-6 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:brightness-105 sm:flex-none sm:px-8"
              >
                {t("continue")}
                <ChevronRight className="size-4" />
              </button>
            ) : flowStep === REVIEW_STEP ? (
              <button
                type="button"
                onClick={preparePaymentStep}
                disabled={savingDraft}
                className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand to-brand-hover px-6 py-2.5 text-sm font-bold text-white shadow-[var(--shadow-button)] transition-all hover:-translate-y-0.5 sm:flex-none sm:px-8"
              >
                {savingDraft ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
                {savingDraft ? t("savingDraft") : t("finish")}
                <ChevronRight className="size-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={submitCheckout}
                disabled={checkoutLoading}
                className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand to-brand-hover px-6 py-2.5 text-sm font-bold text-white shadow-[var(--shadow-button)] transition-all hover:-translate-y-0.5 disabled:opacity-60 sm:flex-none sm:px-8"
              >
                {checkoutLoading ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
                {checkoutLoading ? t("paymentLoading") : t("paymentSubmit")}
                <ChevronRight className="size-4" />
              </button>
            )}
          </div>
        </div>
      ) : null}

      {templateDemoSlug && demoTemplate && templateModalDemo ? (
        <div
          className="fixed inset-0 z-[80] flex items-end justify-center bg-ink/50 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-sm sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="template-demo-title"
        >
          <button
            type="button"
            className="absolute inset-0"
            onClick={() => setTemplateDemoSlug(null)}
            aria-label={t("closeDemo")}
          />
          <div className="relative z-[1] max-h-[min(92dvh,42rem)] w-full max-w-sm overflow-y-auto rounded-[1.75rem] border border-white/30 bg-canvas p-4 shadow-2xl sm:max-w-md sm:p-5">
            <div className="mb-3 flex items-start justify-between gap-3">
              <p id="template-demo-title" className="min-w-0 font-display text-lg font-semibold leading-tight text-ink">
                {demoTemplate.name}
              </p>
              <button
                type="button"
                onClick={() => setTemplateDemoSlug(null)}
                className="shrink-0 rounded-full p-2 text-muted transition-colors hover:bg-ink/8 hover:text-ink"
                aria-label={t("closeDemo")}
              >
                <X className="size-5" />
              </button>
            </div>
            <InvitationPreviewStage
              variant="card"
              theme={demoTemplate?.filterId}
              startUnlocked
              showTemplateFooter
              videoSrc={videoSrc}
              previewEyebrow={templateModalDemo.previewEyebrow}
              previewNames={templateModalDemo.previewNames}
              previewTagline={templateModalDemo.previewTagline}
              previewDate={templateModalDemo.previewDate}
              previewVenue={templateModalDemo.previewVenue}
              previewMapsCta={templateModalDemo.previewMapsCta}
              mapEmbedUrl={templateModalDemo.mapEmbedUrl}
              mapsOpenUrl={templateModalDemo.mapsOpenUrl}
              templateName={demoTemplate.name}
              heroImage={resolveTemplateHeroImage(demoTemplate.slug, demoTemplate.image)}
            />
            <p className="mt-3 text-center text-[0.65rem] text-muted">{t("templatePickSubtitle")}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
