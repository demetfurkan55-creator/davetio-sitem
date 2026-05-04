"use client";

import { useLocale, useTranslations } from "next-intl";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { DavetiyeTemplateCard } from "@/components/davetio/DavetiyeTemplateCard";
import { InvitationPreviewStage } from "@/components/davetio/InvitationPreviewStage";
import { cn } from "@/lib/utils";
import { resolveInviteVideoUrl } from "@/lib/invite-ambient-video";
import { getTemplatePreviewDemo } from "@/lib/template-preview-demo";
import { resolveTemplateHeroImage } from "@/lib/template-preview-images";

const templateGridContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07 },
  },
};

const templateGridItem = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.48, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export type MarketCategory = { id: string; label: string };

export type MarketTemplate = {
  slug: string;
  filterId: string;
  name: string;
  category: string;
  tag: string;
  image: string;
  imageAlt: string;
  cardEyebrow: string;
  cardCouple: string;
  cardDate: string;
  priceStrike: string;
  priceCurrent: string;
  /** İsteğe bağlı; yoksa ortam videosu `NEXT_PUBLIC_INVITE_AMBIENT_VIDEO` veya mesaj yedeği */
  videoSrc?: string;
};

export function CategoryMarket({
  categories,
  templates,
  luxuryCards,
}: {
  categories: MarketCategory[];
  templates: MarketTemplate[];
  /** Davetiye Katalogu — premium kart görünümü */
  luxuryCards?: boolean;
}) {
  const t = useTranslations("Landing");
  const tp = useTranslations("Landing.previewModal");
  const locale = useLocale();
  const [filter, setFilter] = useState("all");
  const [preview, setPreview] = useState<MarketTemplate | null>(null);
  const [previewTab, setPreviewTab] = useState<"invite" | "video">("invite");
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const visible = useMemo(
    () =>
      filter === "all"
        ? templates
        : templates.filter((x) => x.filterId === filter),
    [filter, templates],
  );

  const activePreviewDemo = useMemo(
    () => (preview ? getTemplatePreviewDemo(preview.slug, locale) : null),
    [preview, locale],
  );

  useEffect(() => {
    if (preview) setPreviewTab("invite");
  }, [preview?.slug]);

  useEffect(() => {
    if (!preview) return;
    const body = document.body;
    const html = document.documentElement;
    const prevOverflow = body.style.overflow;
    const prevPadding = html.style.paddingRight;
    body.style.overflow = "hidden";
    const scrollbarW = window.innerWidth - html.clientWidth;
    if (scrollbarW > 0) html.style.paddingRight = `${scrollbarW}px`;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPreview(null);
    };
    window.addEventListener("keydown", onKey);
    const raf = requestAnimationFrame(() => closeBtnRef.current?.focus());

    return () => {
      cancelAnimationFrame(raf);
      body.style.overflow = prevOverflow;
      html.style.paddingRight = prevPadding;
      window.removeEventListener("keydown", onKey);
    };
  }, [preview]);

  return (
    <>
      <div className="-mx-1 mb-10 overflow-x-auto pb-1 sm:mx-0 sm:overflow-visible">
        <div className="flex min-w-max snap-x snap-mandatory gap-2 px-1 sm:flex-wrap sm:justify-center sm:px-0">
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setFilter(c.id)}
              className={cn(
                "snap-start rounded-2xl border px-4 py-2.5 text-xs font-bold uppercase tracking-[0.12em] transition-all duration-300 sm:text-[0.7rem]",
                filter === c.id
                  ? "border-seal-gold/40 bg-seal-navy text-white shadow-[0_10px_32px_-8px_rgba(20,31,56,0.35)] ring-1 ring-seal-gold/30"
                  : "border-ink/10 bg-white/95 text-muted shadow-sm hover:border-seal-gold/25 hover:text-ink",
                luxuryCards && "shadow-[0_4px_20px_rgba(20,31,56,0.06)]",
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <motion.div
        key={filter}
        className={cn(
          "grid grid-cols-1 gap-5 sm:grid-cols-2",
          luxuryCards ? "lg:grid-cols-3" : "lg:grid-cols-4",
        )}
        variants={templateGridContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.12 }}
      >
        {visible.map((item) => {
          const loc = locale === "de" ? "de-DE" : "tr-TR";
          const categoryUpper = item.category.toLocaleUpperCase(loc);
          return (
            <motion.div key={item.slug} variants={templateGridItem} className="min-h-0">
              <DavetiyeTemplateCard
                slug={item.slug}
                imageAlt={item.imageAlt}
                coverImage={item.image}
                title={item.name}
                tagBadge={item.tag}
                categoryBadge={categoryUpper}
                priceStrike={item.priceStrike}
                priceCurrent={item.priceCurrent}
                ctaLabel={t("templates.viewProduct")}
                cardEyebrow={item.cardEyebrow}
                cardCouple={item.cardCouple}
                cardDate={item.cardDate}
                gallery={!!luxuryCards}
                onPreview={() => setPreview(item)}
                previewLabel={t("templates.preview")}
                luxury={luxuryCards}
              />
            </motion.div>
          );
        })}
      </motion.div>

      <AnimatePresence>
        {preview ? (
          <motion.div
            key={preview.slug}
            className="fixed inset-0 z-[200] flex items-end justify-center p-3 sm:items-center sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-label={preview.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.button
              type="button"
              className="absolute inset-0 cursor-default bg-ink/55 backdrop-blur-[2px]"
              onClick={() => setPreview(null)}
              aria-label={tp("close")}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="davetio-modal-panel relative z-10 w-full max-w-[min(100%,520px)] will-change-transform"
              initial={{ opacity: 0, y: 14, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.985 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              layout={false}
            >
            <div className="overflow-hidden rounded-[1.75rem] border border-white/25 bg-canvas shadow-2xl ring-1 ring-brand/10">
              <div className="flex items-center justify-between border-b border-ink/[0.06] bg-white/95 px-4 py-3 backdrop-blur-md">
                <span className="text-xs font-bold uppercase tracking-[0.12em] text-brand">
                  {tp("subtitle")}
                </span>
                <button
                  ref={closeBtnRef}
                  type="button"
                  onClick={() => setPreview(null)}
                  className="rounded-xl p-2 text-muted transition-all duration-200 hover:bg-brand-muted hover:text-brand"
                >
                  <X className="size-5" aria-hidden />
                  <span className="sr-only">{tp("close")}</span>
                </button>
              </div>
              <div className="davetio-scrollbar-hide relative max-h-[min(82vh,720px)] touch-pan-y overflow-y-auto overscroll-y-contain bg-gradient-to-b from-white via-canvas to-canvas-muted p-4 sm:p-5">
                <div
                  className="mb-4 flex rounded-2xl border border-ink/[0.08] bg-white/90 p-1 shadow-inner"
                  role="tablist"
                  aria-label={tp("subtitle")}
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={previewTab === "invite"}
                    onClick={() => setPreviewTab("invite")}
                    className={cn(
                      "flex-1 rounded-xl py-2.5 text-center text-xs font-bold uppercase tracking-wide transition-all",
                      previewTab === "invite"
                        ? "bg-brand text-white shadow-md"
                        : "text-muted hover:text-ink",
                    )}
                  >
                    {tp("tabInvite")}
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={previewTab === "video"}
                    onClick={() => setPreviewTab("video")}
                    className={cn(
                      "flex-1 rounded-xl py-2.5 text-center text-xs font-bold uppercase tracking-wide transition-all",
                      previewTab === "video"
                        ? "bg-brand text-white shadow-md"
                        : "text-muted hover:text-ink",
                    )}
                  >
                    {tp("tabVideo")}
                  </button>
                </div>

                {previewTab === "invite" && activePreviewDemo ? (
                  <>
                    <InvitationPreviewStage
                      startUnlocked
                      theme={preview.filterId}
                      videoSrc={resolveInviteVideoUrl({
                        templateOverride: preview.videoSrc,
                        messageFallback: tp("videoSrc"),
                      })}
                      previewEyebrow={activePreviewDemo.previewEyebrow}
                      previewNames={activePreviewDemo.previewNames}
                      previewDate={activePreviewDemo.previewDate}
                      previewTagline={activePreviewDemo.previewTagline}
                      previewVenue={activePreviewDemo.previewVenue}
                      previewMapsCta={activePreviewDemo.previewMapsCta}
                      mapEmbedUrl={activePreviewDemo.mapEmbedUrl}
                      mapsOpenUrl={activePreviewDemo.mapsOpenUrl}
                      templateName={preview.name}
                      heroImage={resolveTemplateHeroImage(preview.slug, preview.image)}
                    />
                    <p className="mt-4 text-center text-[0.7rem] font-medium leading-relaxed text-muted">
                      {tp("inviteLiveHint")}
                    </p>
                  </>
                ) : (
                  <div className="space-y-3">
                    <video
                      key={preview.slug}
                      poster={resolveTemplateHeroImage(preview.slug, preview.image)}
                      src={resolveInviteVideoUrl({
                        templateOverride: preview.videoSrc,
                        messageFallback: tp("videoSrc"),
                      })}
                      controls
                      muted
                      playsInline
                      className="aspect-video w-full rounded-2xl border border-ink/[0.08] bg-ink object-cover shadow-inner"
                    />
                    <p className="text-center text-xs leading-relaxed text-muted">{tp("videoNote")}</p>
                  </div>
                )}

                <div className="mt-5 flex justify-center gap-2">
                  <Link
                    href={`/templates/${preview.slug}`}
                    onClick={() => setPreview(null)}
                    className="rounded-2xl bg-brand px-5 py-2.5 text-xs font-bold text-white shadow-[var(--shadow-button)] transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {t("templates.viewProduct")}
                  </Link>
                </div>
              </div>
            </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
