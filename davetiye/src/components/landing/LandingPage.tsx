import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PenLine, ScrollText } from "lucide-react";
import { LandingFloralAmbient } from "@/components/landing/LandingFloralAmbient";
import { LandingShowcaseCatalog } from "@/components/landing/LandingShowcaseCatalog";
import { LandingPremiumFooter } from "@/components/landing/LandingPremiumFooter";

export async function LandingPage({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "Landing" });
  const catalogItems = t.raw("templates.items");
  const catalogCategories = t.raw("categories");

  return (
    <div className="relative flex min-h-[100dvh] w-full max-w-[100vw] flex-col overflow-x-hidden">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: "#F5EFEB",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.22] mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`,
        }}
        aria-hidden
      />
      <LandingFloralAmbient />

      <header className="fixed inset-x-0 top-0 z-50 border-b border-[#c9a44a]/10 bg-[#fdfbf8]/75 pt-[env(safe-area-inset-top,0px)] backdrop-blur-md">
        <div className="mx-auto flex max-w-[88rem] min-w-0 items-center justify-between gap-3 px-[max(0.75rem,env(safe-area-inset-left,0px))] py-4 pr-[max(0.75rem,env(safe-area-inset-right,0px))] sm:px-10">
          <Link href="/" className="group flex min-w-0 items-center gap-2.5 sm:gap-3">
            <span
              className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[#c9a44a]/45 bg-gradient-to-br from-white/90 to-[#f5efeb]/95 shadow-[0_4px_22px_rgba(74,20,32,0.09)] ring-1 ring-[#c9a44a]/25 backdrop-blur-sm transition group-hover:border-[#c9a44a]/65"
              aria-hidden
            >
              <ScrollText className="size-[1.15rem] text-[#6b1d2e]" strokeWidth={1.35} />
            </span>
            <span className="font-display text-[1.15rem] font-medium tracking-tight text-[#4a1420] sm:text-[1.35rem]">
              Davetio<span className="text-[#b8923f]">.</span>
            </span>
          </Link>
          <nav className="flex shrink-0 items-center gap-2 sm:gap-4" aria-label="Ana menü">
            <Link
              href="/katalog"
              className="text-xs font-medium text-[#4a1420]/78 transition hover:text-[#6b1d2e] sm:text-sm"
            >
              {t("nav.catalog")}
            </Link>
            <Link
              href="/olustur"
              className="inline-flex items-center gap-1.5 rounded-full border border-[#c9a44a]/35 bg-gradient-to-b from-[#f8efd4] to-[#dfc07a] px-3.5 py-2 text-xs font-semibold text-[#2a0c12] shadow-[0_10px_28px_-12px_rgba(140,100,40,0.35)] ring-1 ring-white/50 transition hover:brightness-105 sm:px-5 sm:text-sm"
            >
              <PenLine className="size-3.5 opacity-90" strokeWidth={2} aria-hidden />
              {t("nav.ctaCreate")}
            </Link>
          </nav>
        </div>
      </header>

      <main className="min-w-0 flex-1 overflow-x-hidden pt-[calc(4.25rem+env(safe-area-inset-top,0px))]">
        <LandingShowcaseCatalog
          items={catalogItems}
          categories={catalogCategories}
          gridEyebrow={t("vitrine.gridEyebrow")}
          ctaCreate={t("vitrine.ctaCreate")}
          emptyCategory={t("vitrine.emptyCategory")}
          filterAria={t("vitrine.filterAria")}
        />
      </main>

      <LandingPremiumFooter />
    </div>
  );
}
