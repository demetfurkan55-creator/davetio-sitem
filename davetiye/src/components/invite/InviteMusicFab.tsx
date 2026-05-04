"use client";

import { createInviteOpeningPianoBlobUrl } from "@/lib/invite-opening-audio";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";

type Placement = "fixed" | "absolute";

export function InviteMusicFab({
  placement = "fixed",
  className,
  /** Zarf açıldı / slaytlar görünür — plak görsel olarak döner */
  spinActive = false,
  /** Her artışta bir kez sessiz piyanoyu çalmayı dener (tarayıcı politikası izin verirse) */
  playAttemptKey = 0,
}: {
  placement?: Placement;
  className?: string;
  spinActive?: boolean;
  playAttemptKey?: number;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const firedPlayAttempt = useRef(0);

  const spinning = playing || spinActive;

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      if (audioRef.current?.src.startsWith("blob:")) {
        URL.revokeObjectURL(audioRef.current.src);
      }
    };
  }, []);

  useEffect(() => {
    if (!playAttemptKey || firedPlayAttempt.current === playAttemptKey) return;
    firedPlayAttempt.current = playAttemptKey;
    let a = audioRef.current;
    try {
      if (!a) {
        const url = createInviteOpeningPianoBlobUrl();
        a = new Audio(url);
        a.loop = true;
        a.volume = 0.34;
        audioRef.current = a;
      }
      void a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } catch {
      /* ignore */
    }
  }, [playAttemptKey]);

  const toggle = useCallback(() => {
    let a = audioRef.current;
    if (!a) {
      try {
        const url = createInviteOpeningPianoBlobUrl();
        a = new Audio(url);
        a.loop = true;
        a.volume = 0.34;
        audioRef.current = a;
      } catch {
        return;
      }
    }
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      void a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  }, [playing]);

  const positionClass =
    placement === "fixed"
      ? "fixed bottom-5 right-5 z-[60] sm:bottom-8 sm:right-8"
      : "absolute bottom-3 right-3 z-[60]";

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        positionClass,
        "flex size-14 items-center justify-center rounded-full border border-[#c9a44a]/50 bg-[#0f0f0f] text-[#d4af37] shadow-[0_12px_40px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.08)] transition hover:scale-[1.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9a44a] sm:size-16",
        className,
      )}
      aria-label={playing ? "Müziği durdur" : "Müziği çal"}
    >
      <span
        className="absolute inset-0 rounded-full bg-gradient-to-br from-[#2a2a2a] to-[#0a0a0a]"
        aria-hidden
      />
      <motion.span
        className="relative z-[1] flex size-10 items-center justify-center sm:size-11"
        animate={spinning ? { rotate: 360 } : { rotate: 0 }}
        transition={
          spinning
            ? { duration: 8, repeat: Infinity, ease: "linear" }
            : { duration: 0.35 }
        }
        aria-hidden
      >
        <svg viewBox="0 0 48 48" className="size-full" fill="none">
          <circle cx="24" cy="24" r="22" fill="#1a1a1a" stroke="#c9a44a" strokeWidth="1" />
          <circle cx="24" cy="24" r="16" stroke="#2d2d2d" strokeWidth="0.5" opacity="0.8" />
          <circle cx="24" cy="24" r="10" stroke="#2d2d2d" strokeWidth="0.5" opacity="0.5" />
          <circle cx="24" cy="24" r="3.5" fill="#c9a44a" />
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i / 8) * Math.PI * 2;
            return (
              <line
                key={i}
                x1={24 + Math.cos(a) * 6}
                y1={24 + Math.sin(a) * 6}
                x2={24 + Math.cos(a) * 20}
                y2={24 + Math.sin(a) * 20}
                stroke="#3a3a3a"
                strokeWidth="0.4"
                opacity="0.5"
              />
            );
          })}
        </svg>
      </motion.span>
      <span
        className="pointer-events-none absolute -right-0.5 -top-0.5 z-[2] flex size-4 items-center justify-center rounded-full bg-[#c9a44a]/90 text-[0.5rem] font-bold text-black shadow-sm sm:size-[1.125rem]"
        aria-hidden
      >
        ♪
      </span>
    </button>
  );
}
