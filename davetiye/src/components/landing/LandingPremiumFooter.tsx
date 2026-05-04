import {
  Clock,
  Lock,
  Mail,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import { DavetioMark } from "@/components/branding/DavetioMark";

const legalLinks = [
  { label: "Mesafeli Satış Sözleşmesi", href: "#" },
  { label: "İptal ve İade Koşulları", href: "#" },
  { label: "Gizlilik Politikası", href: "#" },
  { label: "Sıkça Sorulan Sorular", href: "#" },
] as const;

/**
 * Kurumsal, yasal ve güven odaklı alt bilgi — ana vitrin sayfası için.
 */
export function LandingPremiumFooter() {
  return (
    <footer className="relative mt-auto overflow-hidden border-t border-white/[0.06] bg-[#0a0b0d] text-[#d4d0c8]">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.45]"
        aria-hidden
      >
        <div className="absolute -left-[20%] top-0 h-[420px] w-[55%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(198,160,74,0.07),transparent_68%)]" />
        <div className="absolute -right-[10%] bottom-0 h-[320px] w-[45%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(30,45,77,0.35),transparent_70%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-5 pb-6 pt-14 sm:px-8 sm:pb-8 sm:pt-16 lg:pt-20">
        <div className="grid gap-12 border-b border-white/[0.08] pb-12 lg:grid-cols-12 lg:gap-10 lg:pb-14">
          <div className="lg:col-span-4">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-5">
              <DavetioMark
                size={52}
                variant="romantic"
                className="ring-1 ring-white/10 ring-offset-2 ring-offset-[#0a0b0d]"
              />
              <div className="min-w-0">
                <p className="font-display text-2xl font-semibold tracking-tight text-[#f5f2ea] sm:text-[1.65rem]">
                  Davetio<span className="text-seal-gold-soft">.</span>
                </p>
                <p className="mt-3 max-w-[20rem] text-sm leading-relaxed text-[#b8b4aa]">
                  Avrupa&apos;nın Premium Dijital Davetiye Platformu
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#9a968c]">
              Yasal
            </p>
            <nav
              className="mt-5 flex flex-col gap-3 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-3"
              aria-label="Yasal bilgiler"
            >
              {legalLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="group text-sm text-[#d4d0c8] transition-colors hover:text-seal-gold-soft"
                >
                  <span className="border-b border-transparent pb-px transition-[border-color] group-hover:border-seal-gold-soft/60">
                    {item.label}
                  </span>
                </a>
              ))}
            </nav>
          </div>

          <div className="lg:col-span-4">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#9a968c]">
              İletişim ve destek
            </p>
            <ul className="mt-5 space-y-4 text-sm">
              <li>
                <a
                  href="mailto:hello@davetio.com"
                  className="group flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 transition-colors hover:border-white/12 hover:bg-white/[0.05]"
                >
                  <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] text-seal-gold-soft ring-1 ring-white/10">
                    <Mail className="size-4" strokeWidth={1.75} aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[0.65rem] font-medium uppercase tracking-wider text-[#9a968c]">
                      E-posta
                    </span>
                    <span className="mt-0.5 block font-medium text-[#f0ebe3] transition-colors group-hover:text-seal-gold-soft">
                      hello@davetio.com
                    </span>
                  </span>
                </a>
              </li>
              <li className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3">
                <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] text-seal-gold-soft ring-1 ring-white/10">
                  <Clock className="size-4" strokeWidth={1.75} aria-hidden />
                </span>
                <span>
                  <span className="block text-[0.65rem] font-medium uppercase tracking-wider text-[#9a968c]">
                    Çalışma saatleri
                  </span>
                  <span className="mt-0.5 block leading-snug text-[#d4d0c8]">
                    Pazartesi — Cuma, 09:00 – 18:00{" "}
                    <span className="text-[#9a968c]">(CET)</span>
                  </span>
                </span>
              </li>
              <li>
                <div className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3">
                  <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-300/95 ring-1 ring-emerald-400/25">
                    <MessageCircle
                      className="size-4"
                      strokeWidth={1.75}
                      aria-hidden
                    />
                  </span>
                  <span>
                    <span className="block text-[0.65rem] font-medium uppercase tracking-wider text-[#9a968c]">
                      WhatsApp destek hattı
                    </span>
                    <span className="mt-0.5 block text-[#d4d0c8]">
                      Anında mesajlaşma ile müşteri temsilcimize ulaşın.
                    </span>
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-5 pt-8 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-6 sm:pt-9">
          <p className="text-center text-[0.8125rem] text-[#8c887e] sm:text-left">
            <span className="font-medium text-[#c4c0b6]">Copyright © 2026</span>{" "}
            Davetio. Tüm hakları saklıdır.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:flex-wrap sm:justify-end sm:gap-6">
            <span className="inline-flex items-center gap-2 text-[0.8125rem] text-[#b8b4aa]">
              <Lock
                className="size-3.5 shrink-0 text-seal-gold-soft/90"
                strokeWidth={2}
                aria-hidden
              />
              256-Bit SSL Şifreleme
            </span>
            <span className="hidden h-4 w-px bg-white/15 sm:block" aria-hidden />
            <span className="inline-flex items-center gap-2 text-[0.8125rem] text-[#b8b4aa]">
              <ShieldCheck
                className="size-3.5 shrink-0 text-seal-gold-soft/90"
                strokeWidth={2}
                aria-hidden
              />
              Shopier ile Güvenli Ödeme
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
