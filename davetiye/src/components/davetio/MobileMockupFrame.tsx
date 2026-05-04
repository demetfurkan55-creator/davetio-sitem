"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type MobileMockupFrameProps = {
  children: ReactNode;
  /** Stüdyo sütunu: dar telefon; detay / kart: biraz geniş */
  layout?: "studio" | "detail";
  className?: string;
};

/**
 * Cam efekti + yumuşak altın çerçeve; içerik taşmasını keser, scrollbar gizli kalır (çocuk InvitationPreview).
 */
export function MobileMockupFrame({ children, layout = "detail", className }: MobileMockupFrameProps) {
  const isStudio = layout === "studio";

  return (
    <div
      className={cn(
        "relative mx-auto w-full",
        isStudio ? "max-w-[min(100%,320px)] sm:max-w-sm" : "max-w-sm sm:max-w-md",
        className,
      )}
    >
      <div
        className={cn(
          "relative rounded-[2.75rem] border p-[3px] shadow-[0_32px_90px_-36px_rgba(60,12,24,0.35),0_12px_40px_-20px_rgba(201,164,74,0.2)]",
          "border-[#dfc896]/70 bg-gradient-to-b from-white/50 via-white/30 to-white/10",
          "ring-1 ring-[#c9a44a]/25 backdrop-blur-md",
        )}
      >
        <div
          className={cn(
            "relative overflow-hidden rounded-[2.5rem] ring-1 ring-black/20",
            "bg-gradient-to-b from-zinc-900/95 to-zinc-950 p-2 sm:p-2.5",
            "shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]",
          )}
        >
          <div
            className={cn(
              "relative w-full overflow-hidden rounded-[2rem] bg-[#0c0c0c]",
              isStudio ? "aspect-[9/16] max-h-[min(74dvh,640px)]" : "aspect-[9/16.5] max-h-[min(80dvh,700px)]",
            )}
          >
            <div className="davetio-scrollbar-hide absolute inset-0 flex min-h-0 min-w-0 flex-col overflow-hidden">
              {children}
            </div>
          </div>
        </div>
        <div
          className="pointer-events-none absolute left-1/2 top-2.5 h-1.5 w-16 -translate-x-1/2 rounded-full bg-black/35 sm:top-3"
          aria-hidden
        />
      </div>
    </div>
  );
}
