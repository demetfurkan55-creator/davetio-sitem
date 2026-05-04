"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type Cat = { id: string; label: string };

export function LandingLuxuryHero({
  categories,
  active,
  onCategoryChange,
  filterAria,
}: {
  categories: Cat[];
  active: string;
  onCategoryChange: (id: string) => void;
  filterAria: string;
}) {
  const t = useTranslations("Landing.luxuryHero");
  const reduceMotion = useReducedMotion();

  const particles = Array.from({ length: 22 }, (_, i) => ({
    id: i,
    Icon: i % 4 === 0 ? Sparkles : Heart,
    left: `${(i * 41 + 11) % 94}%`,
    top: `${(i * 29 + 7) % 90}%`,
    duration: 16 + (i % 6) * 2.2,
    delay: (i % 8) * 0.35,
    scale: 0.35 + (i % 5) * 0.12,
  }));

  return (
    <section
      className="relative mx-auto w-full max-w-[88rem] overflow-hidden px-[max(1rem,env(safe-area-inset-left,0px))] pb-10 pt-4 pr-[max(1rem,env(safe-area-inset-right,0px))] sm:px-10 sm:pb-12 sm:pt-6"
      aria-labelledby="luxury-hero-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 -z-[1] rounded-[2rem] bg-gradient-to-b from-[#fce8f0]/50 via-transparent to-transparent sm:rounded-[2.5rem]"
        aria-hidden
      />

      {!reduceMotion ? (
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[2rem] sm:rounded-[2.5rem]" aria-hidden>
          {particles.map((p) => (
            <motion.span
              key={p.id}
              className="absolute text-[#e8a4bf]/[0.55]"
              style={{ left: p.left, top: p.top }}
              initial={{ opacity: 0.15, y: 0, scale: p.scale }}
              animate={{
                opacity: [0.12, 0.55, 0.1, 0.45, 0.08],
                y: [0, -28, 12, -18, 6],
                x: [0, 10, -14, 8, -6],
                rotate: [0, 8, -6, 4, 0],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <p.Icon
                className="drop-shadow-[0_0_10px_rgba(232,164,191,0.35)]"
                style={{ width: "clamp(0.7rem, 2.2vw, 1.15rem)", height: "clamp(0.7rem, 2.2vw, 1.15rem)" }}
                strokeWidth={1.35}
                aria-hidden
              />
            </motion.span>
          ))}
        </div>
      ) : (
        <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.12]" aria-hidden>
          <Heart className="absolute left-[8%] top-[12%] h-4 w-4 text-[#e8a4bf]" aria-hidden />
          <Sparkles className="absolute right-[12%] top-[20%] h-3.5 w-3.5 text-[#e8a4bf]" aria-hidden />
        </div>
      )}

      <div className="relative z-[1] mx-auto flex max-w-4xl flex-col items-center text-center">
        <h1
          id="luxury-hero-heading"
          className="font-display text-[clamp(1.85rem,5.2vw,3.35rem)] font-semibold leading-[1.12] tracking-[-0.03em] text-[#3a1218]"
          style={{ fontFeatureSettings: '"liga" 1, "kern" 1' }}
        >
          {t("headline")}
        </h1>
        <p className="font-accent mt-3 text-[clamp(1.55rem,4.5vw,2.65rem)] leading-none text-[#d9738f] sm:mt-4">
          {t("scriptLine")}
        </p>

        <ul className="mt-8 grid w-full max-w-2xl grid-cols-1 list-none gap-4 sm:mt-10 sm:grid-cols-3 sm:gap-6">
          {(["statCustomers", "statSent", "statSatisfaction"] as const).map((k) => (
            <li
              key={k}
              className="rounded-2xl border border-[#6b1d2e]/[0.08] bg-white/55 px-4 py-3.5 text-sm font-semibold tabular-nums tracking-tight text-[#4a1420] shadow-[0_12px_40px_-28px_rgba(74,20,32,0.25)] backdrop-blur-[2px] sm:text-[0.95rem]"
            >
              {t(k)}
            </li>
          ))}
        </ul>

        <div className="mt-9 sm:mt-10">
          <Link
            href="/olustur"
            className="inline-flex min-h-[3.25rem] items-center justify-center rounded-full bg-[#6b1d2e] px-10 py-3.5 text-sm font-bold tracking-wide text-white shadow-[0_18px_50px_-18px_rgba(107,29,46,0.65)] ring-2 ring-[#6b1d2e]/20 transition hover:bg-[#551825] hover:shadow-[0_22px_56px_-16px_rgba(107,29,46,0.55)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6b1d2e] sm:text-base"
          >
            {t("cta")}
          </Link>
        </div>

        <div
          className="mt-8 flex w-full max-w-3xl flex-wrap items-center justify-center gap-2 sm:mt-9"
          role="tablist"
          aria-label={filterAria}
        >
          {categories.map((c) => {
            const isActive = active === c.id;
            return (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onCategoryChange(c.id)}
                className={cn(
                  "rounded-full border px-3.5 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.12em] transition-all duration-200 sm:px-4 sm:py-2.5 sm:text-[0.68rem]",
                  isActive
                    ? "border-[#6b1d2e] bg-[#6b1d2e] text-white shadow-[0_8px_24px_-10px_rgba(107,29,46,0.45)]"
                    : "border-[#6b1d2e]/18 bg-white/75 text-[#5e5658] shadow-sm hover:border-[#c9a44a]/45 hover:text-[#4a1420]",
                )}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
