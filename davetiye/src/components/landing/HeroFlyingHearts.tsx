import type { CSSProperties } from "react";

/** Uçan kalpler — saf CSS animasyonu (prefers-reduced-motion globals.css’te kapatılır) */

const HEARTS = [
  { left: "6%", top: "8%", delay: "0s", dur: "14s", scale: 0.85, rot: "-12deg", dx: "4px" },
  { left: "14%", top: "72%", delay: "1.2s", dur: "18s", scale: 0.65, rot: "8deg", dx: "-6px" },
  { left: "22%", top: "18%", delay: "2.4s", dur: "16s", scale: 0.55, rot: "-6deg", dx: "8px" },
  { left: "78%", top: "12%", delay: "0.8s", dur: "15s", scale: 0.72, rot: "14deg", dx: "-4px" },
  { left: "88%", top: "58%", delay: "3s", dur: "17s", scale: 0.6, rot: "-10deg", dx: "5px" },
  { left: "72%", top: "82%", delay: "1.8s", dur: "19s", scale: 0.7, rot: "6deg", dx: "-8px" },
  { left: "42%", top: "6%", delay: "4s", dur: "20s", scale: 0.45, rot: "4deg", dx: "3px" },
  { left: "52%", top: "88%", delay: "2s", dur: "13s", scale: 0.58, rot: "-14deg", dx: "-5px" },
  { left: "92%", top: "28%", delay: "1s", dur: "16s", scale: 0.52, rot: "10deg", dx: "7px" },
  { left: "4%", top: "42%", delay: "3.5s", dur: "18s", scale: 0.48, rot: "-8deg", dx: "-3px" },
  { left: "34%", top: "52%", delay: "0.4s", dur: "17s", scale: 0.4, rot: "12deg", dx: "6px" },
  { left: "62%", top: "38%", delay: "2.8s", dur: "15s", scale: 0.62, rot: "-4deg", dx: "-7px" },
  { left: "48%", top: "24%", delay: "5s", dur: "21s", scale: 0.35, rot: "6deg", dx: "2px" },
  { left: "18%", top: "92%", delay: "1.6s", dur: "14s", scale: 0.55, rot: "-18deg", dx: "-5px" },
  { left: "96%", top: "78%", delay: "3.2s", dur: "16s", scale: 0.42, rot: "14deg", dx: "9px" },
];

function HeartSvg({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 21s-6-4.35-6-10a6 6 0 0 1 12 0c0 5.65-6 10-6 10z" />
    </svg>
  );
}

type Props = {
  /** Çok hafif kalpler — sade beyaz hero için */
  subtle?: boolean;
  /** Pembe hero: yumuşak gül / rose */
  tone?: "gold" | "blush";
};

export function HeroFlyingHearts({ subtle = false, tone = "gold" }: Props) {
  const list = subtle ? HEARTS.slice(0, 9) : HEARTS;
  const toneClass =
    subtle && tone === "blush"
      ? "text-accent-rose/[0.16]"
      : subtle
        ? "text-seal-gold/[0.12]"
        : "text-seal-gold/40";
  const floatClass = subtle
    ? "davetio-heart-particle davetio-heart-particle--subtle block"
    : "davetio-heart-particle block";

  return (
    <div
      className={`pointer-events-none absolute inset-0 z-[1] overflow-hidden ${subtle ? "opacity-90" : ""}`}
      aria-hidden
    >
      {list.map((h, i) => (
        <span key={i} className={`absolute ${toneClass}`} style={{ left: h.left, top: h.top }}>
          <span
            className={floatClass}
            style={
              {
                "--davetio-h-dx": h.dx,
                animationDelay: h.delay,
                animationDuration: subtle ? `${Number.parseFloat(h.dur) * 1.28}s` : h.dur,
              } as CSSProperties & { "--davetio-h-dx": string }
            }
          >
            <HeartSvg
              className={
                subtle
                  ? "h-[clamp(0.65rem,1.8vw,0.95rem)] w-[clamp(0.65rem,1.8vw,0.95rem)]"
                  : "h-[clamp(0.85rem,2.5vw,1.35rem)] w-[clamp(0.85rem,2.5vw,1.35rem)] drop-shadow-[0_1px_6px_rgba(178,74,92,0.22)]"
              }
              style={{
                transform: `rotate(${h.rot}) scale(${h.scale})`,
              }}
            />
          </span>
        </span>
      ))}
    </div>
  );
}
