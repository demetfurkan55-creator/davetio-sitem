"use client";

import type { InvitationThemeTokens } from "@/lib/invitation-themes";
import { cn } from "@/lib/utils";

function MandalaLayer({ className }: { className?: string }) {
  return (
    <svg
      className={cn("pointer-events-none absolute inset-0 text-[#D4AF37]", className)}
      viewBox="0 0 400 400"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      aria-hidden
    >
      <circle cx="200" cy="200" r="180" stroke="currentColor" strokeWidth="0.35" opacity="0.12" />
      <circle cx="200" cy="200" r="140" stroke="currentColor" strokeWidth="0.28" opacity="0.1" />
      <circle cx="200" cy="200" r="100" stroke="currentColor" strokeWidth="0.22" opacity="0.08" />
      <path
        d="M200 40 L215 85 L260 60 L245 105 L290 120 L250 145 L275 185 L225 175 L200 220 L175 175 L125 185 L150 145 L110 120 L155 105 L140 60 L185 85 Z"
        stroke="currentColor"
        strokeWidth="0.4"
        opacity="0.09"
      />
      <path
        d="M200 360 L185 315 L140 340 L155 295 L110 280 L150 255 L125 215 L175 225 L200 180 L225 225 L275 215 L250 255 L290 280 L245 295 L260 340 L215 315 Z"
        stroke="currentColor"
        strokeWidth="0.4"
        opacity="0.09"
      />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <g key={deg} transform={`rotate(${deg} 200 200)`} opacity="0.07">
          <path d="M200 30 Q210 100 200 200 Q190 100 200 30" stroke="currentColor" strokeWidth="0.35" />
        </g>
      ))}
    </svg>
  );
}

function EngagementFlorals({ className }: { className?: string }) {
  return (
    <>
      <div
        className={cn(
          "pointer-events-none absolute -left-[10%] top-[12%] h-[45%] w-[45%] rounded-full opacity-[0.16] blur-[80px]",
          className,
        )}
        style={{
          background: "radial-gradient(circle, rgba(252,224,232,0.7) 0%, transparent 65%)",
        }}
        aria-hidden
      />
      <div
        className={cn(
          "pointer-events-none absolute -right-[8%] bottom-[15%] h-[40%] w-[50%] rounded-full opacity-[0.14] blur-[75px]",
          className,
        )}
        style={{
          background: "radial-gradient(circle, rgba(156,175,136,0.45) 0%, transparent 62%)",
        }}
        aria-hidden
      />
      <svg
        className="pointer-events-none absolute left-[2%] top-[20%] h-32 w-20 text-[#9caf88]/[0.25]"
        viewBox="0 0 60 100"
        fill="none"
        aria-hidden
      >
        <path
          d="M30 8c8 12 12 28 8 44-6-8-16-6-22 2 6-16 4-34-2-48 6 4 12 4 16 2z"
          fill="currentColor"
        />
      </svg>
      <svg
        className="pointer-events-none absolute bottom-[18%] right-[4%] h-36 w-24 scale-x-[-1] text-[#c9a8b8]/[0.22]"
        viewBox="0 0 60 100"
        fill="none"
        aria-hidden
      >
        <path
          d="M30 10c10 10 14 26 10 42-8-6-18-4-24 4 4-14 2-32-6-44 8 2 14 0 20-2z"
          fill="currentColor"
        />
      </svg>
    </>
  );
}

function NikahMarble({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden>
      <div
        className="absolute inset-0 opacity-[0.85]"
        style={{
          background:
            "linear-gradient(145deg, #ffffff 0%, #f1f5f9 38%, #e8eef5 72%, #f8fafc 100%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.07] mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.12'/%3E%3C/svg%3E")`,
        }}
      />
      <div
        className="absolute -left-[20%] top-0 h-[50%] w-[70%] rounded-full opacity-[0.08] blur-[90px]"
        style={{
          background: "radial-gradient(ellipse, rgba(148,163,184,0.35) 0%, transparent 60%)",
        }}
      />
      <div
        className="absolute -bottom-[10%] right-0 h-[45%] w-[55%] rounded-full opacity-[0.06] blur-[85px]"
        style={{
          background: "radial-gradient(ellipse, rgba(203,213,225,0.5) 0%, transparent 58%)",
        }}
      />
    </div>
  );
}

function WeddingIvoryWash({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden>
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(175deg, #faf6f0 0%, #f2ebe2 42%, #ebe3d8 100%)",
        }}
      />
      <div
        className="absolute -left-[18%] top-[8%] h-[48%] w-[62%] rounded-full opacity-[0.18] blur-[95px]"
        style={{
          background:
            "radial-gradient(ellipse at 35% 35%, rgba(201,164,74,0.14) 0%, transparent 62%)",
        }}
      />
      <div
        className="absolute -right-[12%] bottom-[8%] h-[42%] w-[58%] rounded-full opacity-[0.14] blur-[88px]"
        style={{
          background:
            "radial-gradient(ellipse at 55% 55%, rgba(107,29,46,0.1) 0%, transparent 65%)",
        }}
      />
      <div
        className="absolute left-[15%] top-[25%] h-[30%] w-[40%] rounded-full opacity-[0.08] blur-[70px]"
        style={{
          background: "radial-gradient(circle, rgba(255,200,210,0.35) 0%, transparent 55%)",
        }}
      />
      <div className="davetio-grain absolute inset-0 opacity-[0.18] mix-blend-multiply" />
    </div>
  );
}

function HennaVelvetWash({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden bg-[#5C0910]", className)} aria-hidden>
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 120% 80% at 50% 0%, rgba(120,20,28,0.5) 0%, transparent 55%), radial-gradient(ellipse 90% 60% at 80% 100%, rgba(40,4,6,0.55) 0%, transparent 50%), linear-gradient(180deg, #6e0e14 0%, #5C0910 45%, #3d0609 100%)",
        }}
      />
      <MandalaLayer className="opacity-90" />
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}

function EngagementWash({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden>
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(168deg, #f5f8f4 0%, #eef4ec 35%, #ebe8f0 100%)",
        }}
      />
      <EngagementFlorals />
      <div className="davetio-grain absolute inset-0 opacity-[0.12] mix-blend-multiply" />
    </div>
  );
}

export function InvitationThemeBackdrop({
  tokens,
  className,
}: {
  tokens: InvitationThemeTokens;
  className?: string;
}) {
  switch (tokens.backdrop) {
    case "henna":
      return <HennaVelvetWash className={className} />;
    case "engagement":
      return <EngagementWash className={className} />;
    case "nikah":
      return <NikahMarble className={className} />;
    default:
      return <WeddingIvoryWash className={className} />;
  }
}

export function ThemeFloralEdges({
  tokens,
}: {
  tokens: InvitationThemeTokens;
}) {
  const base =
    tokens.id === "henna"
      ? "text-[#D4AF37]/[0.14]"
      : tokens.id === "engagement"
        ? "text-[#9caf88]/[0.2]"
        : tokens.id === "nikah"
          ? "text-slate-400/[0.18]"
          : "text-[#6b1d2e]/[0.14]";

  return (
    <>
      <svg
        className={cn("pointer-events-none absolute left-0 top-[18%] h-[38%] w-[18%] max-w-[5rem]", base)}
        viewBox="0 0 80 200"
        fill="none"
        aria-hidden
      >
        <path
          d="M8 180c16-28 20-64 8-96 14 6 30-2 38-18-6 22-2 48 12 66-18-6-38 8-44 32-4-10-10-12-14-8z"
          fill="currentColor"
          opacity="0.5"
        />
        <path
          d="M40 12c24 12 30 44 22 72-16-10-36-6-48 8 8-30 4-62-8-88 12 6 26 8 34 8z"
          stroke="currentColor"
          strokeWidth="0.45"
          opacity="0.4"
        />
      </svg>
      <svg
        className={cn(
          "pointer-events-none absolute right-0 top-[18%] h-[38%] w-[18%] max-w-[5rem] scale-x-[-1]",
          base,
        )}
        viewBox="0 0 80 200"
        fill="none"
        aria-hidden
      >
        <path
          d="M8 180c16-28 20-64 8-96 14 6 30-2 38-18-6 22-2 48 12 66-18-6-38 8-44 32-4-10-10-12-14-8z"
          fill="currentColor"
          opacity="0.5"
        />
      </svg>
    </>
  );
}
