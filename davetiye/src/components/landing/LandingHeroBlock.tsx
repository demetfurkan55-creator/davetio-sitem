"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const ease = [0.22, 1, 0.36, 1] as const;

export function LandingHeroBlock() {
  const t = useTranslations("Landing");
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <div className="relative z-[2] mx-auto max-w-3xl px-6 pb-20 pt-8 text-center sm:px-12 sm:pb-28 sm:pt-12 lg:pb-36 lg:pt-14">
        <p className="mx-auto inline-flex max-w-[min(100%,20rem)] items-center justify-center rounded-full border border-white/60 bg-white/80 px-3 py-1.5 text-[0.58rem] font-semibold uppercase leading-snug tracking-[0.12em] text-ink/60 shadow-sm backdrop-blur-sm sm:max-w-none sm:px-4 sm:text-[0.63rem] sm:tracking-[0.15em]">
          {t("hero.eyebrow")}
        </p>
        <h1 className="mt-8 px-0.5 font-display text-[clamp(1.65rem,5.2vw+0.6rem,2.15rem)] font-semibold leading-[1.08] tracking-tight text-ink sm:mt-10 sm:px-0 sm:text-[2.55rem] lg:text-[3.15rem]">
          {t("hero.headline")}
        </h1>
        <p className="font-accent mt-3 break-words px-0.5 text-[clamp(1.35rem,4vw+0.5rem,1.75rem)] leading-tight text-seal-gold sm:mt-4 sm:text-[2.05rem] lg:text-[2.35rem]">
          {t("hero.scriptLine")}
        </p>
        <div className="mt-10 flex flex-col items-center px-1 sm:mt-14">
          <Link
            href="/olustur"
            className="inline-flex w-full max-w-sm items-center justify-center gap-2 rounded-full bg-seal-navy px-8 py-3.5 text-sm font-bold text-white shadow-[0_16px_42px_-12px_rgba(178,74,92,0.35)] ring-1 ring-seal-gold/40 transition hover:brightness-110 min-[400px]:max-w-none min-[400px]:min-w-[min(100%,17rem)] min-[400px]:px-10"
          >
            <Heart className="size-4 fill-white/35" aria-hidden />
            {t("hero.ctaPrimary")}
          </Link>
        </div>
      </div>
    );
  }

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.11, delayChildren: 0.05 },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 28, filter: "blur(10px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.72, ease },
    },
  };

  const scriptLine = {
    hidden: { opacity: 0, y: 20, scale: 0.97 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.78, ease, delay: 0.04 },
    },
  };

  const ctaGroup = {
    hidden: { opacity: 0, y: 22 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.58, ease, delay: 0.08 },
    },
  };

  return (
    <motion.div
      className="relative z-[2] mx-auto max-w-3xl px-6 pb-20 pt-8 text-center sm:px-12 sm:pb-28 sm:pt-12 lg:pb-36 lg:pt-14"
      initial="hidden"
      animate="show"
      variants={container}
    >
      <motion.p
        variants={fadeUp}
        className="mx-auto inline-flex max-w-[min(100%,20rem)] items-center justify-center rounded-full border border-white/60 bg-white/80 px-3 py-1.5 text-[0.58rem] font-semibold uppercase leading-snug tracking-[0.12em] text-ink/60 shadow-sm backdrop-blur-sm sm:max-w-none sm:px-4 sm:text-[0.63rem] sm:tracking-[0.15em]"
      >
        {t("hero.eyebrow")}
      </motion.p>
      <motion.h1
        variants={fadeUp}
        className="mt-8 px-0.5 font-display text-[clamp(1.65rem,5.2vw+0.6rem,2.15rem)] font-semibold leading-[1.08] tracking-tight text-ink sm:mt-10 sm:px-0 sm:text-[2.55rem] lg:text-[3.15rem]"
      >
        {t("hero.headline")}
      </motion.h1>
      <motion.p
        variants={scriptLine}
        className="font-accent mt-3 break-words px-0.5 text-[clamp(1.35rem,4vw+0.5rem,1.75rem)] leading-tight text-seal-gold sm:mt-4 sm:text-[2.05rem] lg:text-[2.35rem]"
      >
        {t("hero.scriptLine")}
      </motion.p>

      <motion.div variants={ctaGroup} className="mt-10 flex flex-col items-center px-1 sm:mt-14">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full max-w-sm min-[400px]:max-w-none">
          <Link
            href="/olustur"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-seal-navy px-8 py-3.5 text-sm font-bold text-white shadow-[0_16px_42px_-12px_rgba(178,74,92,0.35)] ring-1 ring-seal-gold/40 transition hover:brightness-110 min-[400px]:min-w-[min(100%,17rem)] min-[400px]:px-10"
          >
            <motion.span
              className="inline-flex items-center gap-2"
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Heart className="size-4 fill-white/35" aria-hidden />
              {t("hero.ctaPrimary")}
            </motion.span>
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
