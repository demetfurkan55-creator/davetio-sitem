"use client";

import { Clock, Lock, Mail, MessageCircle, Shield } from "lucide-react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { DavetioMark } from "@/components/branding/DavetioMark";

const legalItems: (
  | { labelTr: string; labelDe: string; href: "/mesafeli-satis" | "/iptal-iade" | "/gizlilik" }
  | { labelTr: string; labelDe: string; faq: true }
)[] = [
  { labelTr: "Mesafeli Satış Sözleşmesi", labelDe: "Fernabsatzinformation", href: "/mesafeli-satis" },
  { labelTr: "İptal ve İade Koşulları", labelDe: "Stornierung & Rückerstattung", href: "/iptal-iade" },
  { labelTr: "Gizlilik Politikası", labelDe: "Datenschutz", href: "/gizlilik" },
  { labelTr: "Sıkça Sorulan Sorular", labelDe: "FAQ", faq: true },
];

/**
 * Kurumsal alt bilgi — çalışan yasal bağlantılar, güçlü görsel katman.
 */
export function LandingPremiumFooter() {
  const locale = useLocale();

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-white/[0.07] bg-[#060708] text-[#d8d4cc]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_55%_at_50%_-10%,rgba(198,160,74,0.14),transparent_55%)]" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`,
        }}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c6a04a]/35 to-transparent" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        aria-hidden
      >
        <div className="davetio-footer-orb davetio-footer-orb--a absolute -left-[18%] top-0 h-[440px] w-[52%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(198,160,74,0.09),transparent_68%)]" />
        <div className="davetio-footer-orb davetio-footer-orb--b absolute -right-[12%] bottom-0 h-[340px] w-[48%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(30,45,77,0.42),transparent_72%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-5 pb-8 pt-16 sm:px-8 sm:pb-10 sm:pt-20 lg:pt-24">
        <div className="grid gap-14 border-b border-white/[0.09] pb-14 lg:grid-cols-12 lg:gap-12 lg:pb-16">
          <div className="lg:col-span-4">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-6">
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-[#c6a04a]/25 to-transparent opacity-80 blur-md" aria-hidden />
                <DavetioMark
                  size={56}
                  variant="romantic"
                  className="relative ring-1 ring-white/15 ring-offset-4 ring-offset-[#060708]"
                />
              </div>
              <div className="min-w-0">
                <p className="font-display text-[1.75rem] font-semibold tracking-tight text-[#f7f4ec] sm:text-[1.85rem]">
                  Davetio<span className="text-[#dcc896]">.</span>
                </p>
                <p className="mt-4 max-w-[22rem] text-[0.9375rem] leading-relaxed text-[#aeaaa2]">
                  {locale === "de"
                    ? "Premium digitale Einladungen für Hochzeit, Standesamt und besondere Anlässe — elegant, mobil und sicher."
                    : "Düğün, nikah ve özel günleriniz için premium dijital davetiye deneyimi — şık, mobil uyumlu ve güvenli."}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-[#8c887c]">
              {locale === "de" ? "Rechtliches" : "Yasal"}
            </p>
            <nav
              className="mt-6 grid gap-2 sm:grid-cols-2 sm:gap-x-4 sm:gap-y-2"
              aria-label={locale === "de" ? "Rechtliches" : "Yasal bilgiler"}
            >
              {legalItems.map((item) => {
                const label = locale === "de" ? item.labelDe : item.labelTr;
                if ("faq" in item) {
                  return (
                    <a
                      key="faq"
                      href={`/${locale}#sss`}
                      className="group rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3 text-sm text-[#e4e0d8] transition hover:border-[#c6a04a]/35 hover:bg-white/[0.06] hover:text-[#f5f2ea]"
                    >
                      <span className="font-medium leading-snug">{label}</span>
                    </a>
                  );
                }
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3 text-sm text-[#e4e0d8] transition hover:border-[#c6a04a]/35 hover:bg-white/[0.06] hover:text-[#f5f2ea]"
                  >
                    <span className="font-medium leading-snug">{label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="lg:col-span-4">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-[#8c887c]">
              {locale === "de" ? "Kontakt & Support" : "İletişim ve destek"}
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              <li>
                <a
                  href="mailto:hello@davetio.com"
                  className="group flex items-start gap-3 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3.5 transition hover:border-white/14 hover:bg-white/[0.07]"
                >
                  <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.07] text-[#dcc896] ring-1 ring-white/10">
                    <Mail className="size-4" strokeWidth={1.75} aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[0.65rem] font-medium uppercase tracking-wider text-[#8c887c]">
                      E-mail
                    </span>
                    <span className="mt-1 block font-semibold text-[#f2efe8] transition-colors group-hover:text-[#dcc896]">
                      hello@davetio.com
                    </span>
                  </span>
                </a>
              </li>
              <li className="flex items-start gap-3 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3.5">
                <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.07] text-[#dcc896] ring-1 ring-white/10">
                  <Clock className="size-4" strokeWidth={1.75} aria-hidden />
                </span>
                <span>
                  <span className="block text-[0.65rem] font-medium uppercase tracking-wider text-[#8c887c]">
                    {locale === "de" ? "Zeiten" : "Çalışma saatleri"}
                  </span>
                  <span className="mt-1 block leading-snug text-[#d8d4cc]">
                    {locale === "de"
                      ? "Mo–Fr, 09:00–18:00 (MEZ)"
                      : "Pazartesi — Cuma, 09:00 – 18:00 (CET)"}
                  </span>
                </span>
              </li>
              <li>
                <div className="flex items-start gap-3 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3.5">
                  <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/12 text-emerald-200/95 ring-1 ring-emerald-400/20">
                    <MessageCircle className="size-4" strokeWidth={1.75} aria-hidden />
                  </span>
                  <span>
                    <span className="block text-[0.65rem] font-medium uppercase tracking-wider text-[#8c887c]">
                      WhatsApp
                    </span>
                    <span className="mt-1 block text-[#c8c4bc]">
                      {locale === "de"
                        ? "Antwort in der Regel innerhalb eines Werktags."
                        : "Yanıt süresi genelde bir iş günü içindedir."}
                    </span>
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-6 pt-10 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-8 sm:pt-12">
          <p className="text-center text-[0.8125rem] text-[#7a7670] sm:text-left">
            <span className="font-medium text-[#b8b4aa]">Copyright © 2026</span> Davetio.{" "}
            {locale === "de" ? "Alle Rechte vorbehalten." : "Tüm hakları saklıdır."}
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-end sm:gap-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-[0.78rem] text-[#b8b4aa]">
              <Lock className="size-3.5 shrink-0 text-[#c6a04a]/90" strokeWidth={2} aria-hidden />
              TLS 1.2+ · {locale === "de" ? "Verschlüsselte Verbindung" : "Şifreli bağlantı"}
            </span>
            <span className="hidden h-4 w-px bg-white/12 sm:block" aria-hidden />
            <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-[0.78rem] text-[#b8b4aa]">
              <Shield className="size-3.5 shrink-0 text-[#c6a04a]/90" strokeWidth={2} aria-hidden />
              {locale === "de"
                ? "DSGVO-orientierte Datenverarbeitung"
                : "KVKK uyumlu veri işleme"}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
