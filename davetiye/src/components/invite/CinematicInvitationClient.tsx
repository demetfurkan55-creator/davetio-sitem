"use client";

import { InvitationPreview } from "@/components/InvitationPreview";
import { buildGoogleCalendarUrl } from "@/lib/public-invitation";
import type { PublicInvitation } from "@/lib/public-invitation";

export function CinematicInvitationClient({ data }: { data: PublicInvitation }) {
  return (
    <InvitationPreview
      variant="fullscreen"
      theme={data.theme}
      namesDisplay={data.namesDisplay}
      eyebrow={data.eyebrow}
      invitationLine={data.invitationLine}
      dateLine={data.dateLine}
      eventAt={data.eventAt}
      story={data.story}
      venueTitle={data.venueName}
      venueDetail={data.venueAddress}
      mapEmbedUrl={data.mapEmbedUrl}
      mapsOpenUrl={data.mapsOpenUrl}
      mapsButtonLabel="Yol Tarifi"
      rsvpHint={data.rsvpHint}
      calendarUrl={buildGoogleCalendarUrl(data)}
    />
  );
}
