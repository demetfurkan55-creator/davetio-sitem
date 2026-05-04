"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, Flower2, PenLine, Share2 } from "lucide-react";
import { Link } from "@/i18n/navigation";

const copy = {
  tr: {
    kicker: "Davetio · Atölye vitrin",
    headline: "Hayalindeki Davetiyeyi 3 Adımda Tasarla",
    sub: "Katalog karmaşası yok — seç, yaz, müziğini ekle ve tek bağlantıyla paylaş.",
    s1Title: "Tasarımını Seç",
    s1Desc: "Görsel odaklı şablonlardan birini aç; tam ekran önizlemede akışı gör.",
    s2Title: "Bilgilerini Gir",
    s2Desc: "Çift, tarih ve mekân — sakin, zarif formlarla dakikalar içinde tamamla.",
    s3Title: "Müziğini Seç ve Paylaş",
    s3Desc: "Atmosfer müziği ve davet bağlantısı — misafirler kaydırmalı deneyimi yaşasın.",
    cta: "Buradan Başla",
  },
  de: {
    kicker: "Davetio · Atelier",
    headline: "Gestalte deine Einladung in drei klaren Schritten",
    sub: "Kein Katalograuschen — wählen, schreiben, teilen.",
    s1Title: "Design wählen",
    s1Desc: "Visuelle Vorlagen und echte Vorschau.",
    s2Title: "Details eingeben",
    s2Desc: "Paar, Datum und Ort — ruhige Formulare.",
    s3Title: "Musik & Teilen",
    s3Desc: "Stimmung und ein Link für deine Gäste.",
    cta: "Jetzt starten",
  },
} as const;

const ease = [0.22, 1, 0.36, 1] as const;

function JourneyConnector({ flip }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 120 48"
      className={`h-8 w-[4.5rem] shrink-0 text-[#c9a44a]/50 sm:h-10 sm:w-[5.5rem] ${flip ? "rotate-180 sm:rotate-0" : ""}`}
      fill="none"
      aria-hidden
    >
      <path
        d="M4 24h72c16 0 28-10 36-20"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <path
        d="M108 8 112 24 100 20"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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
    <section className="relative min-h-[min(92dvh,920px)] overflow-hidden px-5 pb-28 pt-8 sm:px-12 sm:pb-36 sm:pt-14">
      <div className="relative z-[1] mx-auto max-w-[88rem]">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease }}
          className="text-center text-[0.62rem] font-semibold uppercase tracking-[0.48em] text-[#b8923f]/95"
        >
          {t.kicker}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.05, ease }}
          className="mx-auto mt-10 max-w-[min(100%,52rem)] text-center font-display text-[clamp(2.15rem,7.5vw,4.25rem)] font-normal italic leading-[1.08] tracking-[-0.02em] text-[#4a1420]"
          style={{ fontFeatureSettings: '"liga" 1, "kern" 1' }}
        >
          {t.headline}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.14, ease }}
          className="mx-auto mt-12 max-w-xl text-center text-[0.95rem] leading-[1.75] text-[#5e5658] sm:text-lg"
        >
          {t.sub}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.28, ease }}
          className="mx-auto mt-16 flex justify-center"
        >
          <Link
            href={createHref}
            className="group inline-flex items-center gap-3 rounded-full border border-[#dfc896]/80 bg-gradient-to-b from-[#fdf6e8] via-[#f0d9a6] to-[#d4b060] px-10 py-3.5 text-sm font-semibold tracking-wide text-[#2f0c12] shadow-[0_18px_48px_-20px_rgba(140,100,40,0.55)] ring-1 ring-white/70 transition duration-300 hover:brightness-[1.03] hover:shadow-[0_22px_56px_-18px_rgba(74,20,32,0.25)]"
          >
            {t.cta}
            <ArrowRight className="size-4 opacity-75 transition group-hover:translate-x-0.5" strokeWidth={2} aria-hidden />
          </Link>
        </motion.div>
      </div>

      <div className="relative z-[1] mx-auto mt-24 max-w-6xl lg:mt-32">
        <div className="hidden flex-col gap-0 lg:flex lg:flex-row lg:items-stretch lg:justify-center lg:gap-0">
          {steps.map((s, i) => (
            <div key={s.title} className="flex flex-1 items-center justify-center">
              <motion.article
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.65, delay: i * 0.1, ease }}
                className="flex w-full max-w-sm flex-col items-center px-4 py-2 text-center"
              >
                <div className="flex size-[5.25rem] items-center justify-center rounded-full border border-[#c9a44a]/25 bg-white/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_20px_50px_-30px_rgba(74,20,32,0.12)] backdrop-blur-[2px]">
                  <s.icon className="size-9 text-[#6b1d2e]/90" strokeWidth={1.15} aria-hidden />
                </div>
                <span className="mt-8 text-[0.62rem] font-semibold uppercase tracking-[0.42em] text-[#c9a44a]/90">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="mt-3 font-display text-xl font-medium text-[#4a1420] sm:text-2xl">{s.title}</h2>
                <p className="mt-4 max-w-[22rem] text-sm leading-relaxed text-[#5e5658]/95">{s.desc}</p>
                <Link
                  href={s.href}
                  className="mt-10 inline-flex items-center gap-2 rounded-full border border-[#c9a44a]/45 bg-white/75 px-7 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#4a1420] shadow-[0_12px_32px_-22px_rgba(74,20,32,0.18)] backdrop-blur-sm transition hover:border-[#c9a44a]/70 hover:bg-white"
                >
                  {t.cta}
                </Link>
              </motion.article>
              {i < 2 ? (
                <div className="hidden shrink-0 items-center self-center px-2 xl:flex" aria-hidden>
                  <JourneyConnector />
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-10 lg:hidden">
          {steps.map((s, i) => (
            <motion.div key={s.title} className="w-full max-w-md">
              <motion.article
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.45 }}
                transition={{ duration: 0.6, delay: i * 0.06, ease }}
                className="border border-[#c9a44a]/15 bg-white/45 px-6 py-10 text-center shadow-[0_24px_60px_-40px_rgba(40,10,20,0.14)] backdrop-blur-[3px]"
              >
                <div className="mx-auto flex size-14 items-center justify-center rounded-full border border-[#c9a44a]/22 bg-white/80 text-[#6b1d2e]">
                  <s.icon className="size-7" strokeWidth={1.2} aria-hidden />
                </div>
                <span className="mt-5 block text-[0.6rem] font-semibold uppercase tracking-[0.36em] text-[#c9a44a]">
                  Adım {i + 1}
                </span>
                <h2 className="mt-2 font-display text-lg font-medium text-[#4a1420]">{s.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-[#5e5658]">{s.desc}</p>
                <Link
                  href={s.href}
                  className="mt-8 inline-flex items-center gap-2 rounded-full border border-[#c9a44a]/50 bg-gradient-to-b from-[#f8efd4] to-[#dfc07a] px-6 py-2.5 text-xs font-semibold text-[#3d1219] shadow-md ring-1 ring-white/55"
                >
                  {t.cta}
                </Link>
              </motion.article>
              {i < 2 ? (
                <div className="mt-8 flex justify-center text-[#c9a44a]/55" aria-hidden>
                  <ArrowDown className="size-6" strokeWidth={1.35} />
                </div>
              ) : null}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
