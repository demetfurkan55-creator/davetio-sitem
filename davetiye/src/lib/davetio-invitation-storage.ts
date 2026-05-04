const DRAFT_KEY = "davetio_invitation_draft_v1";
const RSVP_KEY = "davetio_rsvp_guests_v1";

export type SavedInvitationDraft = {
  version: 1;
  savedAt: string;
  templateSlug: string | null;
  pkg: string | null;
  bride: string;
  groom: string;
  brideMother: string;
  brideFather: string;
  groomMother: string;
  groomFather: string;
  eventDate: string;
  eventTime: string;
  venueName: string;
  venueAddress: string;
  mapsLink: string;
  phone: string;
  musicTrackId: string;
  musicTrackTitle: string;
};

export type RsvpGuestRow = {
  name: string;
  status: "yes" | "maybe" | "no";
  party: string;
  when: string;
};

export function saveInvitationDraft(data: SavedInvitationDraft): void {
  try {
    if (typeof window === "undefined") return;
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
  } catch {
    /* quota / private mode */
  }
}

export function loadInvitationDraft(): SavedInvitationDraft | null {
  try {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const v = JSON.parse(raw) as SavedInvitationDraft;
    if (v?.version !== 1 || typeof v.savedAt !== "string") return null;
    return v;
  } catch {
    return null;
  }
}

export function loadRsvpGuests(): RsvpGuestRow[] {
  try {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem(RSVP_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as unknown;
    if (!Array.isArray(arr)) return [];
    return arr.filter(
      (x): x is RsvpGuestRow =>
        typeof x === "object" &&
        x !== null &&
        typeof (x as RsvpGuestRow).name === "string" &&
        ["yes", "maybe", "no"].includes((x as RsvpGuestRow).status),
    ) as RsvpGuestRow[];
  } catch {
    return [];
  }
}

export function saveRsvpGuests(rows: RsvpGuestRow[]): void {
  try {
    if (typeof window === "undefined") return;
    localStorage.setItem(RSVP_KEY, JSON.stringify(rows));
  } catch {
    /* ignore */
  }
}
