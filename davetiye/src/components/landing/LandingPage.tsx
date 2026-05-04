import { getMessages, getTranslations } from "next-intl/server";
import { Heart, ListChecks, Palette, ShieldCheck, type LucideIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { DavetioMark } from "@/components/branding/DavetioMark";
import {
  CategoryMarket,
  type MarketCategory,
  type MarketTemplate,
} from "@/components/davetio/CategoryMarket";
import {
  ExperienceSection,
  type ExperienceItem,
} from "@/components/davetio/ExperienceSection";
import { FaqSection } from "@/components/davetio/FaqSection";
import { FloatingHelp } from "@/components/davetio/FloatingHelp";
import { LandingDesktopNav } from "@/components/landing/LandingDesktopNav";
import { LandingPremiumFooter } from "@/components/landing/LandingPremiumFooter";
import { HeroCoverflowCarousel } from "@/components/landing/HeroCoverflowCarousel";
import { HeroFlyingHearts } from "@/components/landing/HeroFlyingHearts";
import { AmbientPhotoBackdrop } from "@/components/ui/AmbientPhotoBackdrop";
import { SITE_AMBIENT } from "@/lib/site-ambient";

const iconMap: Record<string, LucideIcon> = {
  listChecks: ListChecks,
  palette: Palette,
  shieldCheck: ShieldCheck,
};

type FeatureItem = {
  icon: string;
  title: string;
  desc: string;
};

type ExperienceBlock = {
  tag: string;
  title: string;
  subtitle: string;
  mapCta: string;
  sharePreviewTitle: string;
  musicPreviewLine: string;
  items: ExperienceItem[];
};

type FaqItem = { q: string; a: string };

export async function LandingPage({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "Landing" });
  const messages = await getMessages();
  const faqItems = (messages as { FAQ: { items: FaqItem[] } }).FAQ.items;

  const templateItems = t.raw("templates.items") as MarketTemplate[];
  const categories = t.raw("categories") as MarketCategory[];
  const featureItems = t.raw("features.items") as FeatureItem[];
  const experience = t.raw("experience") as ExperienceBlock;

  const navLink =
    "whitespace-nowrap rounded-lg px-2 py-2 text-[0.8125rem] font-medium leading-tight text-ink/75 transition-colors duration-200 hover:text-seal-navy focus-visible:outline-offset-2 max-lg:py-2.5 xl:text-sm";

  const locHash = (hash: string) =>
    `/${locale}${hash.startsWith("#") ? hash : `#${hash}`}`;

  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-50 border-b border-ink/[0.06] bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:px-6 lg:min-h-[3.35rem] lg:px-8">
          <Link href="/" className="group flex shrink-0 items-center gap-2 sm:gap-2.5">
            <DavetioMark
              size={40}
              variant="romantic"
              className="transition-transform duration-300 group-hover:rotate-[-5deg] group-hover:scale-[1.04]"
            />
            <span className="font-display text-lg font-semibold tracking-tight text-ink sm:text-[1.35rem] lg:text-xl xl:text-2xl">
              Davetio<span className="text-seal-gold">.</span>
            </span>
          </Link>
          <div className="hidden min-w-0 flex-1 justify-center px-2 lg:flex">
            <LandingDesktopNav
              linkClassName={navLink}
              labels={{
                howItWorks: t("nav.howItWorks"),
                features: t("nav.features"),
                templates: t("nav.templates"),
                catalog: t("nav.catalog"),
                pricing: t("nav.pricing"),
                faq: t("nav.faq"),
                panel: t("nav.panel"),
                more: t("nav.more"),
              }}
            />
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <LocaleSwitcher />
            <Link
              href="/olustur"
              className="whitespace-nowrap rounded-2xl bg-seal-navy px-3.5 py-2 text-sm font-semibold text-white shadow-md ring-1 ring-seal-gold/35 transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 sm:px-4"
            >
              {t("nav.ctaCreate")}
            </Link>
          </div>
        </div>
        <nav
          className="flex gap-1 overflow-x-auto scroll-pb-1 border-t border-ink/[0.05] px-4 py-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-2 sm:px-5 [&::-webkit-scrollbar]:hidden lg:hidden"
          aria-label="Mobile"
        >
          <a href={locHash("#adimlar")} className={`${navLink} shrink-0`}>
            {t("nav.howItWorks")}
          </a>
          <a href={locHash("#deneyim")} className={`${navLink} shrink-0`}>
            {t("nav.features")}
          </a>
          <a href={locHash("#sablonlar")} className={`${navLink} shrink-0`}>
            {t("nav.templates")}
          </a>
          <Link href="/katalog" className={`${navLink} shrink-0`}>
            {t("nav.catalog")}
          </Link>
          <a href={locHash("#fiyatlar")} className={`${navLink} shrink-0`}>
            {t("nav.pricing")}
          </a>
          <a href={locHash("#sss")} className={`${navLink} shrink-0`}>
            {t("nav.faq")}
          </a>
          <Link href="/panel" className={`${navLink} shrink-0`}>
            {t("nav.panel")}
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        <section className="davetio-hero-section relative overflow-hidden border-b border-ink/[0.05]">
          <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
            <div className="davetio-hero-blob davetio-hero-blob--a" />
            <div className="davetio-hero-blob davetio-hero-blob--b" />
            <div className="davetio-hero-blob davetio-hero-blob--c" />
            <div className="davetio-hero-shimmer" />
            <div className="davetio-grain absolute inset-0 opacity-[0.35] mix-blend-multiply" />
          </div>
          <HeroFlyingHearts subtle tone="blush" />
          <div className="relative z-[2] mx-auto max-w-3xl px-5 pb-16 pt-4 text-center sm:px-8 sm:pb-20 sm:pt-6 lg:pb-24 lg:pt-8">
            <p className="mx-auto inline-flex items-center rounded-full border border-white/60 bg-white/80 px-4 py-1.5 text-[0.63rem] font-semibold uppercase tracking-[0.15em] text-ink/60 shadow-sm backdrop-blur-sm">
              {t("hero.eyebrow")}
            </p>
            <h1 className="davetio-animate-in mt-8 font-display text-[2rem] font-semibold leading-[1.08] tracking-tight text-ink sm:text-[2.45rem] lg:text-[3rem]">
              {t("hero.headline")}
            </h1>
            <p className="font-accent davetio-animate-in mt-4 text-[1.75rem] leading-tight text-seal-gold sm:text-[2.05rem] lg:text-[2.35rem]">
              {t("hero.scriptLine")}
            </p>

            <div className="davetio-animate-in mt-12 flex flex-col items-center sm:mt-14">
              <Link
                href="/olustur"
                className="inline-flex min-w-[min(100%,17rem)] items-center justify-center gap-2 rounded-full bg-seal-navy px-10 py-3.5 text-sm font-bold text-white shadow-[0_16px_42px_-12px_rgba(178,74,92,0.35)] ring-1 ring-seal-gold/40 transition hover:brightness-110"
              >
                <Heart className="size-4 fill-white/35" aria-hidden />
                {t("hero.ctaPrimary")}
              </Link>
            </div>
          </div>
        </section>

        <section
          id="adimlar"
          className="relative scroll-mt-28 overflow-hidden border-b border-ink/[0.05] bg-white py-16 sm:py-20 lg:scroll-mt-24"
        >
          <AmbientPhotoBackdrop
            src={SITE_AMBIENT.linenPaper}
            overlayClassName="bg-gradient-to-b from-white/88 via-white/74 to-white/93"
          />
          <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-3xl font-semibold text-ink sm:text-[2.35rem]">
                {t("howItWorks.title")}
              </h2>
            </div>
            <div className="relative mt-14">
              <div
                className="pointer-events-none absolute left-[8%] right-[8%] top-9 hidden h-px bg-gradient-to-r from-transparent via-brand/35 to-transparent md:block"
                aria-hidden
              />
              <div className="grid gap-10 md:grid-cols-3 md:gap-6">
                {[
                  { title: t("howItWorks.step1Title"), desc: t("howItWorks.step1Desc") },
                  { title: t("howItWorks.step2Title"), desc: t("howItWorks.step2Desc") },
                  { title: t("howItWorks.step3Title"), desc: t("howItWorks.step3Desc") },
                ].map((s, i) => (
                  <article
                    key={s.title}
                    className="relative rounded-[1.75rem] border border-ink/[0.07] bg-gradient-to-b from-canvas to-canvas-muted/80 p-8 text-left shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
                  >
                    <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-white font-display text-xl font-bold text-brand shadow-sm ring-1 ring-brand/15 md:mx-0">
                      {i + 1}
                    </div>
                    <h3 className="mt-5 font-display text-xl font-semibold text-ink">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{s.desc}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          id="fiyatlar"
          className="relative scroll-mt-28 overflow-hidden border-b border-ink/[0.05] bg-canvas-muted py-14 sm:py-16 lg:scroll-mt-24"
        >
          <AmbientPhotoBackdrop
            src={SITE_AMBIENT.toastAmbient}
            overlayClassName="bg-gradient-to-b from-[#ebe6de]/92 via-[#ebe6de]/76 to-[#ebe6de]/94"
          />
          <div className="relative z-10 mx-auto max-w-3xl px-5 text-center sm:px-8">
            <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
              {t("pricingTeaser.title")}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
              {t("pricingTeaser.body")}
            </p>
          </div>
        </section>

        <section className="relative overflow-hidden py-16 sm:py-20">
          <AmbientPhotoBackdrop
            src={SITE_AMBIENT.ringsSoft}
            overlayClassName="bg-gradient-to-b from-canvas/87 via-canvas/72 to-canvas/91"
          />
          <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="font-display text-3xl font-semibold text-ink sm:text-[2rem]">
                {t("features.title")}
              </h2>
              <p className="mt-3 text-muted">{t("features.subtitle")}</p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {featureItems.map((item) => {
                const Icon = iconMap[item.icon] ?? Palette;
                return (
                  <article
                    key={item.title}
                    className="rounded-[1.5rem] border border-ink/[0.06] bg-white p-8 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
                  >
                    <div className="mb-5 inline-flex rounded-2xl bg-brand-muted p-3.5 text-brand">
                      <Icon className="size-6" strokeWidth={1.5} aria-hidden />
                    </div>
                    <h3 className="font-display text-xl font-semibold text-ink">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{item.desc}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <ExperienceSection
          tag={experience.tag}
          title={experience.title}
          subtitle={experience.subtitle}
          mapCta={experience.mapCta}
          sharePreviewTitle={experience.sharePreviewTitle}
          musicPreviewLine={experience.musicPreviewLine}
          items={experience.items}
        />

        <section
          id="sablonlar"
          className="relative scroll-mt-28 border-t border-ink/[0.06] bg-white lg:scroll-mt-24"
        >
          <div className="border-b border-ink/[0.05] bg-gradient-to-b from-canvas-muted/55 via-white to-white pb-6 pt-10 sm:pb-8 sm:pt-12">
            <HeroCoverflowCarousel slides={templateItems} />
          </div>
          <div className="relative mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
            <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="font-display text-3xl font-semibold text-ink sm:text-[2rem]">
                  {t("templates.title")}
                </h2>
                <p className="mt-2 max-w-2xl text-muted">{t("templates.subtitle")}</p>
              </div>
            </div>
            <CategoryMarket categories={categories} templates={templateItems} />
          </div>
        </section>

        <FaqSection items={faqItems} />
      </main>

      <LandingPremiumFooter />

      <FloatingHelp />
    </div>
  );
}
