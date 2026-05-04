export const TEMPLATE_SLUGS = [
  "serenade-hall",
  "meadow-vows",
  "civic-bloom",
  "ivory-union",
  "rose-script",
  "pearl-mist",
  "golden-hour",
  "marble-vow",
] as const;

export type TemplateSlug = (typeof TEMPLATE_SLUGS)[number];

export function slugToMessageKey(slug: string): string {
  return slug.replace(/-/g, "_");
}
