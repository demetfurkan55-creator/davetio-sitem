"use client";

import { InvitationPreview } from "@/components/InvitationPreview";
import type { InvitationThemeId } from "@/lib/invitation-themes";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

type InvitationPreviewStageProps = {
  videoSrc: string;
  previewEyebrow: string;
  previewNames: string;
  previewDate: string;
  previewTagline: string;
  previewVenue: string;
  previewMapsCta: string;
  mapEmbedUrl: string;
  mapsOpenUrl: string;
  templateName: string;
  heroImage?: string | null;
  variant?: "card" | "studio";
  showTemplateFooter?: boolean;
  coupleFirstName?: string;
  coupleSecondName?: string;
  startUnlocked?: boolean;
  /** Kapak altı cümle; yoksa `previewTagline` */
  invitationLine?: string;
  /** Hikâye metni; yoksa `previewTagline` */
  previewStory?: string;
  /** Geri sayım (ISO); yoksa demo tarih */
  eventAt?: string;
  /** Kategori / tema (wedding, henna, engagement, nikah) */
  theme?: InvitationThemeId | string | null;
};

function splitVenue(venue: string) {
  const i = venue.indexOf(" · ");
  if (i === -1) {
    return { title: venue, detail: "" };
  }
  return { title: venue.slice(0, i).trim(), detail: venue.slice(i + 3).trim() };
}

/**
 * Sinematik dikey davetiye önizlemesi — snap scroll, fildişi / maroon / altın dil.
 * (Arka plan videosu kaldırıldı; odak tam ekran mobil akışta.)
 */
export function InvitationPreviewStage({
  videoSrc,
  heroImage,
  startUnlocked,
  previewEyebrow,
  previewNames,
  previewDate,
  previewTagline,
  previewVenue,
  previewMapsCta,
  mapEmbedUrl,
  mapsOpenUrl,
  templateName,
  variant = "card",
  showTemplateFooter,
  coupleFirstName,
  coupleSecondName,
  invitationLine,
  previewStory,
  eventAt,
  theme,
}: InvitationPreviewStageProps) {
  void videoSrc;
  void heroImage;
  void startUnlocked;
  void coupleFirstName;
  void coupleSecondName;

  const isStudio = variant === "studio";
  const showFooter = showTemplateFooter ?? !isStudio;

  const venueParts = useMemo(() => splitVenue(previewVenue), [previewVenue]);

  const names = previewNames.trim() || "—";

  return (
    <div
      className={cn(
        "relative mx-auto overflow-hidden rounded-[1.75rem] border border-[#d4c4a8]/55 bg-[#faf6f0] shadow-[0_28px_80px_-32px_rgba(40,10,20,0.22)] ring-1 ring-[#6b1d2e]/[0.06]",
        isStudio ? "max-w-[min(100%,21rem)]" : "max-w-[min(100%,380px)]",
      )}
    >
      <div
        className={cn(
          "relative w-full overflow-hidden",
          isStudio ? "aspect-[9/16] max-h-[min(74dvh,620px)]" : "aspect-[9/17] max-h-[min(80dvh,680px)]",
        )}
      >
        <div className="absolute inset-0 flex flex-col">
          <InvitationPreview
          variant="embedded"
          theme={theme}
          skipEnvelope={startUnlocked === true}
          namesDisplay={names}
          eyebrow={previewEyebrow}
          invitationLine={invitationLine ?? previewTagline}
          dateLine={previewDate}
          eventAt={eventAt}
          story={previewStory ?? previewTagline}
          venueTitle={venueParts.title}
          venueDetail={venueParts.detail}
          mapEmbedUrl={mapEmbedUrl}
          mapsOpenUrl={mapsOpenUrl}
          mapsButtonLabel={previewMapsCta}
          templateFooter={showFooter ? templateName : undefined}
        />
        </div>
      </div>
    </div>
  );
}
