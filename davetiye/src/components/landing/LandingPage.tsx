import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Mail, PenLine } from "lucide-react";
import { DavetiyeTemplateCard } from "@/components/davetio/DavetiyeTemplateCard";
import { LandingHeroJourney } from "@/components/landing/LandingHeroJourney";
import { LandingShopierPricing } from "@/components/landing/LandingShopierPricing";
import { LandingPremiumFooter } from "@/components/landing/LandingPremiumFooter";
import type { MarketTemplate } from "@/components/davetio/CategoryMarket";

export async function LandingPage({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "Landing" });
  const templateItems = t.raw("templates.items") as MarketTemplate[];

  return (
    <div className="relative flex min-h-[100dvh] flex-col overflow-x-clip">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: "linear-gradient(175deg, #FDF9F9 0%, #F5EFEB 42%, #f0e8e4 100%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.28] mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`,
        }}
        aria-hidden
      />

      <header className="fixed inset-x-0 top-0 z-50 border-b border-transparent bg-transparent pt-[env(safe-area-inset-top,0px)]">
        <div className="mx-auto flex max-w-6xl min-w-0 items-center justify-between gap-3 px-[max(0.75rem,env(safe-area-inset-left,0px))] py-4 pr-[max(0.75rem,env(safe-area-inset-right,0px))] sm:px-8">
          <Link href="/" className="group flex min-w-0 items-center gap-2.5 sm:gap-3">
            <span
              className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[#c9a44a]/40 bg-white/30 shadow-[0_4px_20px_rgba(74,20,32,0.08)] ring-1 ring-white/50 backdrop-blur-sm transition group-hover:border-[#c9a44a]/55"
              aria-hidden
            >
              <Mail className="size-4 text-[#6b1d2e]" strokeWidth={1.5} />
            </span>
            <span className="font-display text-[1.15rem] font-medium tracking-tight text-[#4a1420] sm:text-[1.35rem]">
              Davetio<span className="text-[#b8923f]">.</span>
            </span>
          </Link>
          <nav className="flex shrink-0 items-center gap-2 sm:gap-4" aria-label="Ana menü">
            <a
              href="#vitrin"
              className="hidden text-xs font-medium text-[#4a1420]/80 transition hover:text-[#6b1d2e] sm:inline sm:text-sm"
            >
              {t("nav.templates")}
            </a>
            <Link
              href="/katalog"
              className="text-xs font-medium text-[#4a1420]/80 transition hover:text-[#6b1d2e] sm:text-sm"
            >
              {t("nav.catalog")}
            </Link>
            <Link
              href="/olustur"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#6b1d2e] px-3.5 py-2 text-xs font-semibold text-white shadow-[0_10px_32px_-10px_rgba(107,29,46,0.45)] ring-1 ring-white/20 transition hover:bg-[#551825] sm:px-5 sm:text-sm"
            >
              <PenLine className="size-3.5 opacity-90" strokeWidth={2} aria-hidden />
              {t("nav.ctaCreate")}
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 pt-[calc(4.25rem+env(safe-area-inset-top,0px))]">
        <LandingHeroJourney locale={locale} catalogHref="/katalog" createHref="/olustur" />

        <LandingShopierPricing locale={locale} />

        <section
          id="vitrin"
          className="scroll-mt-24 px-5 py-16 sm:scroll-mt-28 sm:px-10 sm:py-24"
        >
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-[clamp(1.65rem,4vw,2.35rem)] font-semibold leading-tight text-[#4a1420]">
                {t("templates.title")}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[#5e5658] sm:text-lg">
                {t("templates.subtitle")}
              </p>
            </div>

            <div className="mt-16 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-16">
              {templateItems.map((item) => (
                <DavetiyeTemplateCard
                  key={item.slug}
                  slug={item.slug}
                  imageAlt={item.imageAlt}
                  coverImage={item.image}
                  title={item.name}
                  tagBadge={item.tag}
                  categoryBadge={item.category}
                  priceStrike={item.priceStrike}
                  priceCurrent={item.priceCurrent}
                  ctaLabel={t("templates.viewProduct")}
                  cardEyebrow={item.cardEyebrow}
                  cardCouple={item.cardCouple}
                  cardDate={item.cardDate}
                  gallery
                  luxury
                />
              ))}
            </div>

            <p className="mt-20 text-center">
              <Link
                href="/katalog"
                className="inline-flex rounded-full border border-[#6b1d2e]/15 bg-white/70 px-8 py-3 text-sm font-semibold text-[#6b1d2e] shadow-[0_12px_36px_-18px_rgba(60,20,30,0.12)] backdrop-blur-sm transition hover:border-[#c9a44a]/40"
              >
                {t("nav.catalog")}
              </Link>
            </p>
          </div>
        </section>
      </main>

      <LandingPremiumFooter />
    </div>
  );
}
