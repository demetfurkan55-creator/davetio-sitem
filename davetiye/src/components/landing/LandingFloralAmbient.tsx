"use client";

import { motion } from "framer-motion";

/** Suluboya ve çiçek hissi — PNG yerine vektör (image_18/20 yerine tutarlı dekor). */
export function LandingFloralAmbient() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-[5] overflow-hidden" aria-hidden>
      <div className="davetio-watercolor-wash absolute inset-0 opacity-90" />
      <motion.div
        className="absolute -left-[8%] top-[12%] h-[min(52vw,420px)] w-[min(38vw,280px)] text-[#c9a44a]/[0.22]"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <svg viewBox="0 0 200 280" className="h-full w-full" fill="none">
          <path
            d="M100 20c-18 32-22 68-8 98 14-24 38-34 62-28-28-18-48-46-54-70z"
            fill="currentColor"
            opacity="0.45"
          />
          <path
            d="M40 140c22 8 44 4 62-10-18 28-14 62 8 88-24-20-52-48-70-78z"
            fill="currentColor"
            opacity="0.35"
          />
          <path
            d="M160 160c-14 22-10 50 6 72 12-26 8-56-6-72z"
            fill="currentColor"
            opacity="0.3"
          />
        </svg>
      </motion.div>
      <motion.div
        className="absolute -right-[6%] bottom-[8%] h-[min(48vw,380px)] w-[min(36vw,260px)] scale-x-[-1] text-[#8b4a5c]/[0.18]"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.05, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
      >
        <svg viewBox="0 0 200 280" className="h-full w-full" fill="none">
          <path
            d="M96 24c12 26 10 58-6 82 20-12 46-8 64 8-30-24-44-58-58-90z"
            fill="currentColor"
            opacity="0.5"
          />
          <path
            d="M48 120c28 6 52-2 70-18-8 34 4 72 32 96-30-22-58-52-102-78z"
            fill="currentColor"
            opacity="0.35"
          />
        </svg>
      </motion.div>
    </div>
  );
}
