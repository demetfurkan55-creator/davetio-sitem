import type { RsvpGuestRow, SavedInvitationDraft } from "@/lib/davetio-invitation-storage";

export function isSavedInvitationDraft(v: unknown): v is SavedInvitationDraft {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  if (o.version !== 1 || typeof o.savedAt !== "string") return false;
  const str = (k: string) => typeof o[k] === "string";
  return (
    str("bride") &&
    str("groom") &&
    str("brideMother") &&
    str("brideFather") &&
    str("groomMother") &&
    str("groomFather") &&
    str("eventDate") &&
    str("eventTime") &&
    str("venueName") &&
    str("venueAddress") &&
    str("mapsLink") &&
    str("phone") &&
    str("musicTrackId") &&
    str("musicTrackTitle") &&
    (o.templateSlug === null || typeof o.templateSlug === "string") &&
    (o.pkg === null || typeof o.pkg === "string")
  );
}

export function isRsvpGuestRow(v: unknown): v is RsvpGuestRow {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.name === "string" &&
    (o.status === "yes" || o.status === "maybe" || o.status === "no") &&
    typeof o.party === "string" &&
    typeof o.when === "string"
  );
}

export function parseRsvpGuests(v: unknown): RsvpGuestRow[] {
  if (!Array.isArray(v)) return [];
  return v.filter(isRsvpGuestRow);
}
