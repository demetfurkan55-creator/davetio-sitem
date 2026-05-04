"use client";

import type { InvitationScratchTokens } from "@/lib/invitation-themes";
import { getInvitationThemeTokens, resolveInvitationTheme, type InvitationThemeId } from "@/lib/invitation-themes";
import { useCallback, useEffect, useRef } from "react";

const SIZE = 108;
const BRUSH = 22;

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
  const drawing = useRef(false);
  const scratchKey = `${scratch.hennaMetallic}-${scratch.gradientDeep}`;

  const paint = useCallback((cx: number, cy: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(cx, cy, BRUSH, 0, Math.PI * 2);
    ctx.fill();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2);
    canvas.width = SIZE * dpr;
    canvas.height = SIZE * dpr;
    canvas.style.width = `${SIZE}px`;
    canvas.style.height = `${SIZE}px`;
    ctx.scale(dpr, dpr);

    const cx = SIZE / 2;
    const cy = SIZE / 2;
    const r = SIZE / 2 - 3;

    const g = ctx.createRadialGradient(cx - 16, cy - 16, 4, cx, cy, r);
    g.addColorStop(0, scratch.gradientHigh);
    g.addColorStop(0.28, scratch.gradientMid);
    g.addColorStop(0.62, scratch.gradientDeep);
    g.addColorStop(1, scratch.gradientEdge);

    ctx.globalCompositeOperation = "source-over";
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();

    if (scratch.hennaMetallic) {
      const hi = ctx.createRadialGradient(cx - 22, cy - 22, 2, cx - 8, cy - 8, r * 0.85);
      hi.addColorStop(0, scratch.specular);
      hi.addColorStop(0.45, "rgba(255,255,255,0.08)");
      hi.addColorStop(1, "rgba(0,0,0,0)");
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = hi;
      ctx.fill();

      ctx.beginPath();
      ctx.strokeStyle = scratch.strokeHighlight;
      ctx.lineWidth = 1.8;
      ctx.arc(cx, cy, r - 1, 0.2, 1.1);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.strokeStyle = scratch.strokeHighlight;
      ctx.lineWidth = 1.2;
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.4, cy - r * 0.2);
    ctx.bezierCurveTo(cx, cy - r * 0.5, cx + r * 0.5, cy, cx, cy + r * 0.35);
    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = scratch.numberOnSeal;
    ctx.font = "600 11px var(--font-montserrat), ui-sans-serif, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`${index + 1}`, cx, cy + 1);
  }, [index, scratch, scratchKey]);

  const onPointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drawing.current = true;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    paint(e.clientX - rect.left, e.clientY - rect.top);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drawing.current) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    paint(e.clientX - rect.left, e.clientY - rect.top);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    drawing.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        <p
          className="absolute inset-0 z-0 flex items-center justify-center px-2 text-center text-[0.6rem] font-semibold leading-tight sm:text-xs"
          style={{ color: scratch.revealText }}
          aria-hidden
        >
          {revealText}
        </p>
        <canvas
          ref={canvasRef}
          className="relative z-[1] cursor-grab touch-none active:cursor-grabbing rounded-full"
          style={{ boxShadow: scratch.canvasShadow }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          role="img"
          aria-label={`Kazı alanı ${index + 1}`}
        />
      </div>
    </div>
  );
}

type ScratchGoldCoinsProps = {
  dateLine: string;
  /** Doğrudan kazı görünümü */
  scratch?: InvitationScratchTokens;
  /** Tema id — scratch verilmezse temadan türetilir */
  themeId?: InvitationThemeId | string | null;
};

export function ScratchGoldCoins({ dateLine, scratch, themeId }: ScratchGoldCoinsProps) {
  const s =
    scratch ?? getInvitationThemeTokens(resolveInvitationTheme(themeId)).scratch;

  return (
    <div className="flex flex-wrap items-start justify-center gap-6 sm:gap-10">
      {[0, 1, 2].map((i) => (
        <ScratchCoin key={i} index={i} revealText={dateLine} scratch={s} />
      ))}
    </div>
  );
}
