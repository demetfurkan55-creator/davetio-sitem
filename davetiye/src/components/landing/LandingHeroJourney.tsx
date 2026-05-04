"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, Flower2, PenLine, Share2 } from "lucide-react";
import { Link } from "@/i18n/navigation";

const copy = {
  tr: {
    kicker: "Sinematik davetiye deneyimi",
    headline: "Hayalindeki Davetiyeyi 3 Adımda Tasarla",
    sub: "Katalog gürültüsü yok — sadece seç, yaz, paylaş. Her slayt bir sahnedir.",
    s1Title: "Tasarımını Seç",
    s1Desc: "Görsel odaklı şablonlardan birini aç; önizlemede gerçek mobil akışı gör.",
    s2Title: "Bilgilerini Gir",
    s2Desc: "Çift, tarih ve mekân — sakin, zarif formlarla dakikalar içinde tamamla.",
    s3Title: "Müziğini Seç",
    s3Desc: "Atmosfer müziği ve tek bağlantı — misafirlerin kaydırmalı davetiyeni yaşasın.",
    cta: "Buradan Başla",
  },
  de: {
    kicker: "Cinematic Einladung",
    headline: "Gestalte deine Einladung in 3 klaren Schritten",
    sub: "Kein Katalograuschen — wählen, schreiben, teilen. Jede Folie ist eine Szene.",
    s1Title: "Design wählen",
    s1Desc: "Visuelle Vorlagen öffnen und die echte Mobile-Vorschau erleben.",
    s2Title: "Details eingeben",
    s2Desc: "Paar, Datum und Ort — ruhige, elegante Formulare.",
    s3Title: "Musik",
    s3Desc: "Stimmung und ein Link — Gäste scrollen durch eure Geschichte.",
    cta: "Jetzt starten",
  },
} as const;

const ease = [0.22, 1, 0.36, 1] as const;

const paperShell = "rounded-[1.5rem] border border-[#c9a44a]/22 davetio-paper-step";

export function LandingHeroJourney({
  locale,
  catalogHref,
  createHref,
}: {
  locale: string;
  catalogHref: string;
  createHref: string;
}) {
  const t = copy[locale === "de" ? "de" : "tr"];

  const steps = [
    {
      title: t.s1Title,
      desc: t.s1Desc,
      icon: Flower2,
      href: catalogHref,
    },
    {
      title: t.s2Title,
      desc: t.s2Desc,
      icon: PenLine,
      href: createHref,
    },
    {
      title: t.s3Title,
      desc: t.s3Desc,
      icon: Share2,
      href: createHref,
    },
  ];

  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-6 sm:px-8 sm:pb-28 sm:pt-10">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(201,164,74,0.1), transparent), radial-gradient(ellipse 60% 40% at 100% 50%, rgba(107,29,46,0.05), transparent)",
        }}
        aria-hidden
      />

      <div className="relative z-[1] mx-auto max-w-5xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease }}
          className="text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-[#b8923f]"
        >
          {t.kicker}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.06, ease }}
          className="mt-6 font-display text-[clamp(2rem,6.5vw,3.75rem)] font-normal leading-[1.12] tracking-tight text-[#4a1420]"
        >
          {t.headline}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12, ease }}
          className="mx-auto mt-7 max-w-2xl font-display text-base italic leading-relaxed text-[#5e5658] sm:text-lg"
        >
          {t.sub}
        </motion.p>
      </div>

      <div className="relative z-[1] mx-auto mt-20 max-w-6xl">
        <div className="hidden justify-between gap-6 lg:flex">
          {steps.map((s, i) => (
            <div key={s.title} className="relative flex flex-1 flex-col items-center">
              <motion.div
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.55, delay: i * 0.08, ease }}
                className={`flex w-full flex-col items-center px-6 py-9 text-center ${paperShell}`}
              >
                <span className="flex size-14 items-center justify-center rounded-full border border-[#c9a44a]/35 bg-white/60 text-[#6b1d2e] shadow-inner">
                  <s.icon className="size-7" strokeWidth={1.25} aria-hidden />
                </span>
                <span className="mt-5 text-[0.65rem] font-bold uppercase tracking-[0.22em] text-[#c9a44a]">
                  {i + 1}
                </span>
                <h3 className="mt-2 font-display text-xl font-semibold text-[#4a1420]">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#5e5658]">{s.desc}</p>
                <Link
                  href={s.href}
                  className="mt-8 inline-flex items-center gap-2 rounded-full border border-[#c9a44a]/50 bg-gradient-to-b from-[#f8efd4] to-[#dfc07a] px-7 py-2.5 text-sm font-semibold text-[#3d1219] shadow-[0_8px_28px_-12px_rgba(140,100,40,0.4)] ring-1 ring-white/60 transition hover:brightness-105"
                >
                  {t.cta} →
                  <ArrowRight className="size-4 opacity-80" aria-hidden />
                </Link>
              </motion.div>
              {i < 2 ? (
                <div
                  className="pointer-events-none absolute -right-3 top-[42%] hidden xl:block"
                  aria-hidden
                >
                  <svg width="48" height="12" viewBox="0 0 48 12" className="text-[#c9a44a]/55">
                    <path
                      d="M0 6h36m0 0l-6-5m6 5l-6 5"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-7 lg:hidden">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.52, delay: i * 0.06, ease }}
              className={`relative px-5 py-7 ${paperShell}`}
            >
              <div className="flex gap-4">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-[#c9a44a]/30 bg-white/70 text-[#6b1d2e]">
                  <s.icon className="size-6" strokeWidth={1.25} aria-hidden />
                </span>
                <div className="min-w-0 text-left">
                  <span className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-[#c9a44a]">
                    Adım {i + 1}
                  </span>
                  <h3 className="font-display text-lg font-semibold text-[#4a1420]">{s.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#5e5658]">{s.desc}</p>
                  <Link
                    href={s.href}
                    className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#c9a44a]/50 bg-gradient-to-b from-[#f8efd4] to-[#dfc07a] px-5 py-2 text-xs font-semibold text-[#3d1219] shadow-md ring-1 ring-white/50"
                  >
                    {t.cta} →
                  </Link>
                </div>
              </div>
              {i < 2 ? (
                <div className="mt-5 flex justify-center text-[#c9a44a]/55">
                  <ArrowDown className="size-5" strokeWidth={1.25} aria-hidden />
                </div>
              ) : null}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
