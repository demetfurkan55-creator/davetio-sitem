import { useId } from "react";
import { cn } from "@/lib/utils";

export type DavetioMarkVariant = "seal" | "romantic";

/**
 * Davetio balmumu mühür amblemi — vektör (lacivert / altın), tüm çözünürlüklerde keskin.
 * `romantic`: hafif altın gölge + çok yumuşak nefes animasyonu (motion-safe).
 */
export function DavetioMark({
  className,
  size = 40,
  variant = "seal",
  "aria-hidden": ariaHidden = true,
}: {
  className?: string;
  size?: number;
  variant?: DavetioMarkVariant;
  "aria-hidden"?: boolean;
}) {
  const raw = useId();
  const uid = raw.replace(/\W/g, "") || "mark";
  const waxId = `davetio-wax-${uid}`;
  const goldId = `davetio-gold-${uid}`;
  const rimId = `davetio-rim-${uid}`;
  const glowId = `davetio-glow-${uid}`;

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center [forced-color-adjust:none]",
        variant === "romantic" &&
          "drop-shadow-[0_6px_22px_rgba(198,160,97,0.35)] davetio-mark-breathe brightness-[1.03] contrast-[1.04] saturate-[1.06]",
        className,
      )}
      style={{ width: size, height: size }}
      aria-hidden={ariaHidden}
    >
      <svg
        viewBox="0 0 80 80"
        className="h-full w-full overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <defs>
          <radialGradient id={waxId} cx="32%" cy="28%" r="78%">
            <stop offset="0%" stopColor="#2a3d5e" />
            <stop offset="42%" stopColor="#1e2d4d" />
            <stop offset="100%" stopColor="#0f1628" />
          </radialGradient>
          <linearGradient id={goldId} x1="18%" y1="12%" x2="88%" y2="92%">
            <stop offset="0%" stopColor="#ead4a0" />
            <stop offset="45%" stopColor="#c6a04a" />
            <stop offset="100%" stopColor="#8f7234" />
          </linearGradient>
          <linearGradient id={rimId} x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#dcc896" />
            <stop offset="100%" stopColor="#6b5630" />
          </linearGradient>
          <filter id={glowId} x="-35%" y="-35%" width="170%" height="170%">
            <feGaussianBlur stdDeviation="1.2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Dış balmumu — hafif dalgalı siluet */}
        <path
          fill={`url(#${waxId})`}
          stroke={`url(#${rimId})`}
          strokeWidth="2.15"
          strokeLinejoin="round"
          d="M40 6.5c2.1 0 4.1.35 6 .95 1.25.4 2.45.95 3.55 1.6l1.1.65c3.1 1.85 5.65 4.55 7.35 7.85l.45.9c.55 1.15.95 2.35 1.2 3.6.35 1.55.55 3.15.55 4.8 0 2.35-.4 4.6-1.15 6.7-.45 1.2-1.05 2.35-1.75 3.4-.85 1.3-1.85 2.5-3 3.55-1.35 1.2-2.9 2.2-4.6 2.95l-.85.4c-1.45.6-3 1-4.6 1.15-1.05.1-2.1.15-3.15.15-1.85 0-3.65-.2-5.35-.65l-1.1-.3c-2.55-.75-4.85-2-6.85-3.65-1.15-.95-2.2-2.05-3.1-3.25-1.35-1.85-2.35-3.95-2.9-6.25-.35-1.45-.55-2.95-.55-4.5 0-2.5.45-4.85 1.3-7 .5-1.2 1.15-2.35 1.95-3.4 1.35-1.85 3.1-3.45 5.1-4.7l.95-.55c1.55-.85 3.25-1.45 5.05-1.75.95-.15 1.9-.25 2.9-.3z"
        />

        <ellipse cx="30" cy="26" rx="16" ry="11" fill="white" opacity="0.07" />

        {/* İnce iç halka */}
        <circle
          cx="40"
          cy="40"
          r="24.5"
          stroke={`url(#${goldId})`}
          strokeWidth="0.55"
          strokeOpacity="0.45"
          fill="none"
          strokeDasharray="3 4"
        />

        {/* Monogram D + zarif kıvrım */}
        <g filter={variant === "romantic" ? `url(#${glowId})` : undefined}>
          <path
            fill={`url(#${goldId})`}
            d="M33.2 27.2h8.4c6.2 0 10.6 3.35 10.6 9.55 0 6.35-4.45 10.45-11.2 10.45h-7.8V27.2zm4.35 4.1v11.75h3.35c3.55 0 6.05-2.05 6.05-5.85 0-3.75-2.45-5.9-6-5.9h-3.4z"
          />
          <path
            fill="#c6a04a"
            fillOpacity="0.55"
            d="M48.5 48.2c2.8 1.15 4.85 3.35 5.2 6.1.45 3.6-2.55 6.5-6.55 6.5-2.35 0-4.45-1-5.85-2.65l2.65-2.1c.75.85 1.85 1.35 3.05 1.35 1.85 0 3.1-1.15 2.9-2.85-.15-1.35-1.6-2.5-3.95-3.25l2.55-3.1z"
          />
        </g>

        {/* Minik mühür damgası — kalp */}
        <path
          fill="#b24a5c"
          fillOpacity="0.88"
          d="M40 58.2c-2.1-1.85-3.6-3.15-3.6-4.85 0-1.25 1-2.2 2.25-2.2.85 0 1.55.4 2.05 1.05l.3.4.3-.4c.5-.65 1.2-1.05 2.05-1.05 1.25 0 2.25.95 2.25 2.2 0 1.7-1.5 3-3.6 4.85L40 59.5l-.35-.3z"
        />
      </svg>
    </span>
  );
}
