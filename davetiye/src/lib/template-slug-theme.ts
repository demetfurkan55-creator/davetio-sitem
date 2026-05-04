import type { InvitationThemeId } from "@/lib/invitation-themes";

const SLUG_TO_THEME: Record<string, InvitationThemeId> = {
  "serenade-hall": "wedding",
  "meadow-vows": "wedding",
  "rose-script": "wedding",
  "civic-bloom": "nikah",
  "ivory-union": "nikah",
  "marble-vow": "nikah",
  "pearl-mist": "engagement",
  "golden-hour": "henna",
};

export function getThemeIdForTemplateSlug(slug: string): InvitationThemeId {
  return SLUG_TO_THEME[slug] ?? "wedding";
}
