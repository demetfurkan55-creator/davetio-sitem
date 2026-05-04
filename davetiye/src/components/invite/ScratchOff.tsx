"use client";

import type { InvitationScratchTokens } from "@/lib/invitation-themes";
import {
  getInvitationThemeTokens,
  resolveInvitationTheme,
  type InvitationThemeId,
} from "@/lib/invitation-themes";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

const LOGICAL_SIZE = 118;
const BRUSH_LOGICAL = 24;

function drawLuxurySeal(
  ctx: CanvasRenderingContext2D,
  scratch: InvitationScratchTokens,
  index: number,
  size: number,
) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 4;

  const g = ctx.createRadialGradient(cx - 18, cy - 22, 3, cx, cy, r + 2);
  g.addColorStop(0, scratch.gradientHigh);
  g.addColorStop(0.22, scratch.gradientMid);
  g.addColorStop(0.55, scratch.gradientDeep);
  g.addColorStop(1, scratch.gradientEdge);

  ctx.globalCompositeOperation = "source-over";
  ctx.beginPath();
  ctx.arc(cx, cy, r + 1.5, 0, Math.PI * 2);
  const rim = ctx.createRadialGradient(cx, cy, r * 0.3, cx, cy, r + 2);
  rim.addColorStop(0, "rgba(255,248,220,0.35)");
  rim.addColorStop(0.7, "rgba(80,50,20,0.12)");
  rim.addColorStop(1, "rgba(40,20,10,0.35)");
  ctx.fillStyle = rim;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = g;
  ctx.fill();

  const hi = ctx.createRadialGradient(cx - 28, cy - 28, 2, cx - 6, cy - 8, r * 0.95);
  hi.addColorStop(0, scratch.specular);
  hi.addColorStop(0.35, "rgba(255,255,255,0.22)");
  hi.addColorStop(0.65, "rgba(255,255,255,0.03)");
  hi.addColorStop(1, "rgba(0,0,0,0)");
  ctx.beginPath();
  ctx.arc(cx, cy, r - 0.5, 0, Math.PI * 2);
  ctx.fillStyle = hi;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx, cy, r - 4, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(255,255,255,0.22)";
  ctx.lineWidth = 1.2;
  ctx.stroke();

  ctx.beginPath();
  ctx.strokeStyle = scratch.strokeHighlight;
  ctx.lineWidth = scratch.hennaMetallic ? 2 : 1.35;
  ctx.arc(cx, cy, r - 1, 0.15, 1.35);
  ctx.stroke();

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r - 2, 0, Math.PI * 2);
  ctx.clip();
  for (let i = 0; i < 40; i++) {
    const ang = (i / 40) * Math.PI * 2;
    ctx.fillStyle = `rgba(255,255,255,${0.03 + (i % 5) * 0.008})`;
    ctx.fillRect(cx + Math.cos(ang) * (r * 0.55) - 1, cy + Math.sin(ang) * (r * 0.55) - 1, 2.5, 2.5);
  }
  ctx.restore();

  ctx.fillStyle = scratch.numberOnSeal;
  ctx.font = "700 12px var(--font-montserrat), ui-sans-serif, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(`${index + 1}`, cx, cy + 1);
}

function estimateClearRatio(canvas: HTMLCanvasElement): number {
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return 0;
  const w = canvas.width;
  const h = canvas.height;
  if (!w || !h) return 0;
  const { data } = ctx.getImageData(0, 0, w, h);
  const step = 8;
  let transparent = 0;
  let total = 0;
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      const i = (y * w + x) * 4;
      total++;
      if ((data[i + 3] ?? 255) < 42) transparent++;
    }
  }
  return total ? transparent / total : 0;
}

function ScratchCoin({
  revealText,
  index,
  scratch,
}: {
  revealText: string;
  index: number;
  scratch: InvitationScratchTokens;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const drawing = useRef(false);
  const activePointerId = useRef<number | null>(null);
  const rafPaint = useRef<number | null>(null);
  const pending = useRef<{ x: number; y: number } | null>(null);
  const checkScheduled = useRef(false);
  const reduce = useReducedMotion();
  const [revealed, setRevealed] = useState(false);

  const paintAt = useCallback(
    (lx: number, ly: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(lx, ly, BRUSH_LOGICAL, 0, Math.PI * 2);
      ctx.fill();
    },
    [],
  );

  const flushPaint = useCallback(() => {
    rafPaint.current = null;
    const p = pending.current;
    pending.current = null;
    if (!p) return;
    paintAt(p.x, p.y);
  }, [paintAt]);

  const queuePaint = useCallback(
    (lx: number, ly: number) => {
      pending.current = { x: lx, y: ly };
      if (rafPaint.current != null) return;
      rafPaint.current = requestAnimationFrame(flushPaint);
    },
    [flushPaint],
  );

  const maybeReveal = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || revealed) return;
    const ratio = estimateClearRatio(canvas);
    if (ratio > 0.32) {
      setRevealed(true);
    }
  }, [revealed]);

  const scheduleCheck = useCallback(() => {
    if (checkScheduled.current) return;
    checkScheduled.current = true;
    requestAnimationFrame(() => {
      checkScheduled.current = false;
      maybeReveal();
    });
  }, [maybeReveal]);

  const scratchKey = `${scratch.hennaMetallic}-${scratch.gradientDeep}-${index}`;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(LOGICAL_SIZE * dpr);
    canvas.height = Math.round(LOGICAL_SIZE * dpr);
    canvas.style.width = `${LOGICAL_SIZE}px`;
    canvas.style.height = `${LOGICAL_SIZE}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawLuxurySeal(ctx, scratch, index, LOGICAL_SIZE);
    setRevealed(false);
  }, [index, scratch, scratchKey]);

  useEffect(() => {
    const onWinMove = (e: PointerEvent) => {
      if (!drawing.current || e.pointerId !== activePointerId.current) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const lx = e.clientX - rect.left;
      const ly = e.clientY - rect.top;
      if (lx < -BRUSH_LOGICAL || ly < -BRUSH_LOGICAL || lx > rect.width + BRUSH_LOGICAL || ly > rect.height + BRUSH_LOGICAL) {
        return;
      }
      queuePaint(
        (lx / rect.width) * LOGICAL_SIZE,
        (ly / rect.height) * LOGICAL_SIZE,
      );
      scheduleCheck();
    };

    const endStroke = (e: PointerEvent) => {
      if (e.pointerId !== activePointerId.current) return;
      drawing.current = false;
      activePointerId.current = null;
      scheduleCheck();
    };

    window.addEventListener("pointermove", onWinMove, { passive: true });
    window.addEventListener("pointerup", endStroke);
    window.addEventListener("pointercancel", endStroke);

    return () => {
      window.removeEventListener("pointermove", onWinMove);
      window.removeEventListener("pointerup", endStroke);
      window.removeEventListener("pointercancel", endStroke);
      if (rafPaint.current != null) cancelAnimationFrame(rafPaint.current);
    };
  }, [queuePaint, scheduleCheck]);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    activePointerId.current = e.pointerId;
    drawing.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    queuePaint(
      ((e.clientX - rect.left) / rect.width) * LOGICAL_SIZE,
      ((e.clientY - rect.top) / rect.height) * LOGICAL_SIZE,
    );
    scheduleCheck();
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.pointerId !== activePointerId.current) return;
    drawing.current = false;
    activePointerId.current = null;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    scheduleCheck();
  };

  return (
    <div ref={wrapRef} className="flex flex-col items-center gap-3">
      <div
        className="relative rounded-full"
        style={{
          width: LOGICAL_SIZE,
          height: LOGICAL_SIZE,
          boxShadow: `${scratch.canvasShadow}, 0 24px 48px -28px rgba(40, 20, 10, 0.35), inset 0 2px 0 rgba(255,255,255,0.35)`,
        }}
      >
        <motion.p
          className={cn(
            "absolute inset-0 z-0 flex items-center justify-center px-2 text-center text-[0.58rem] font-semibold leading-tight sm:text-[0.65rem]",
            revealed ? "z-[2]" : "z-0",
          )}
          style={{ color: scratch.revealText }}
          initial={false}
          animate={
            revealed && !reduce
              ? { y: [5, 0], opacity: 1, scale: [0.99, 1] }
              : { y: 0, opacity: 1, scale: 1 }
          }
          transition={{ duration: reduce ? 0.1 : 0.55, ease: [0.22, 1, 0.36, 1] }}
          aria-live="polite"
        >
          {revealText}
        </motion.p>
        <canvas
          ref={canvasRef}
          className={cn(
            "relative z-[1] cursor-grab rounded-full touch-none select-none active:cursor-grabbing",
            revealed && "pointer-events-none opacity-0 transition-opacity duration-500",
          )}
          style={{ touchAction: "none" }}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          role="img"
          aria-label={`Kazı alanı ${index + 1}`}
        />
      </div>
    </div>
  );
}

type ScratchGoldCoinsProps = {
  dateLine: string;
  scratch?: InvitationScratchTokens;
  themeId?: InvitationThemeId | string | null;
};

/** Lüks altın mühür kazı-kazan — dokunma ve fare için kararlı işaretçi akışı. */
export function ScratchGoldCoins({ dateLine, scratch, themeId }: ScratchGoldCoinsProps) {
  const s = scratch ?? getInvitationThemeTokens(resolveInvitationTheme(themeId)).scratch;

  return (
    <div className="flex flex-wrap items-start justify-center gap-8 sm:gap-12 md:gap-16">
      {[0, 1, 2].map((i) => (
        <ScratchCoin key={i} index={i} revealText={dateLine} scratch={s} />
      ))}
    </div>
  );
}
