"use client";

import {
  InvitationPreview,
  type InvitationPreviewHandle,
} from "@/components/InvitationPreview";
import { MobileMockupFrame } from "@/components/davetio/MobileMockupFrame";
import type { InvitationThemeId } from "@/lib/invitation-themes";
import { forwardRef, memo, useMemo } from "react";

export function splitInvitationVenueLine(venue: string) {
  const i = venue.indexOf(" · ");
  if (i === -1) {
    return { title: venue, detail: "" };
  }
  return { title: venue.slice(0, i).trim(), detail: venue.slice(i + 3).trim() };
}

export type InvitationPreviewStageProps = {
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
  /** Kategori / tema (wedding, henna, engagement, nikah) veya filterId */
  theme?: InvitationThemeId | string | null;
  /** Dış telefon çerçevesi; tam ekran modal gibi daraltılmış kullanımlar için */
  frameless?: boolean;
};

/**
 * Dikey snap davetiye — MobileMockupFrame içinde tam etkileşimli canlı önizleme.
 */
export const InvitationPreviewStage = memo(
  forwardRef<InvitationPreviewHandle, InvitationPreviewStageProps>(function InvitationPreviewStage(
    {
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
      frameless = false,
    },
    ref,
  ) {
    void videoSrc;
    void heroImage;
    void coupleFirstName;
    void coupleSecondName;

    const isStudio = variant === "studio";
    const showFooter = showTemplateFooter ?? !isStudio;

    const venueParts = useMemo(() => splitInvitationVenueLine(previewVenue), [previewVenue]);

    const names = previewNames.trim() || "—";

    const inner = (
      <InvitationPreview
        ref={ref}
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
    );

    if (frameless) {
      return inner;
    }

    return (
      <MobileMockupFrame layout={isStudio ? "studio" : "detail"}>{inner}</MobileMockupFrame>
    );
  })
);

InvitationPreviewStage.displayName = "InvitationPreviewStage";
