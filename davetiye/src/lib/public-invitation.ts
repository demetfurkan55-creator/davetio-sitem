import { INVITE_MAP_EMBED_TR } from "@/lib/invite-assets";
import type { InvitationThemeId } from "@/lib/invitation-themes";

export type PublicInvitation = {
  slug: string;
  /** wedding | henna | engagement | nikah */
  theme?: InvitationThemeId;
  namesDisplay: string;
  eyebrow: string;
  tagline: string;
  story: string;
  dateLine: string;
  /** Geri sayım ve takvim bağlantıları için ISO-8601 (örn. 2026-06-14T18:30:00+03:00) */
  eventAt: string;
  /** Google Calendar bitiş; yoksa eventAt + 5 saat varsayılır */
  eventEndAt?: string;
  /** Kapak alt satırı */
  invitationLine: string;
  venueName: string;
  venueAddress: string;
  mapsLabel: string;
  mapsOpenUrl: string;
  mapEmbedUrl: string;
  rsvpHint: string;
};

const DEMO: Record<string, PublicInvitation> = {
  "asli-ve-hakan": {
    slug: "asli-ve-hakan",
    theme: "wedding",
    namesDisplay: "Aslı & Hakan",
    eyebrow: "Düğünümüze",
    tagline: "Sevgimizi paylaşmak için en özel günümüzdesiniz.",
    story:
      "İlk buluşmamızdan bu yana hayatımızın ritmini birlikte yazdık. Şimdi aynı şarkının en güzel köşesinde, sizlerle birlikte dans etmek istiyoruz.",
    dateLine: "14 Haziran 2026 · 18:30",
    eventAt: "2026-06-14T18:30:00+03:00",
    eventEndAt: "2026-06-14T23:30:00+03:00",
    invitationLine: "Mutluluğumuza Davetlisiniz",
    venueName: "Boğaz Köşk · Özel etkinlik salonu",
    venueAddress: "Çubuklu Mah. Haydar Bey Yalısı Yanı · Beykoz / İstanbul",
    mapsLabel: "Haritada konumu aç",
    mapsOpenUrl: "https://www.google.com/maps/search/?api=1&query=41.1256,29.1087",
    mapEmbedUrl: INVITE_MAP_EMBED_TR,
    rsvpHint: "Katılım durumunuzu aşağıdan iletebilirsiniz — en geç 20 Mayıs.",
  },
  "zeynep-ve-ahmet": {
    slug: "zeynep-ve-ahmet",
    theme: "wedding",
    namesDisplay: "Zeynep & Ahmet",
    eyebrow: "Kutlamamıza",
    tagline: "Kalbimizin ortak attığı geceye davetlisiniz.",
    story:
      "Zamanın bizi bir araya getirdiği günden beri, birbirimize yazdığımız her cümlede ‘biz’ olduk. Bu akşamı sizinle taçlandırmak istiyoruz.",
    dateLine: "8 Ağustos 2026 · 19:00",
    eventAt: "2026-08-08T19:00:00+03:00",
    eventEndAt: "2026-08-09T00:00:00+03:00",
    invitationLine: "Mutluluğumuza Davetlisiniz",
    venueName: "Grand Ballroom · İstanbul",
    venueAddress: "Vişnezade Mah. Acısu Sok. No:19 · Beşiktaş / İstanbul",
    mapsLabel: "Yol tarifi",
    mapsOpenUrl: "https://www.google.com/maps/search/?api=1&query=41.0427,29.0083",
    mapEmbedUrl: INVITE_MAP_EMBED_TR,
    rsvpHint: "LCV yanıtınız bizim için çok değerli — teşekkürler.",
  },
};

/** Kök URL segment’leri — davetiye rewrite’ına düşmemeli */
export const RESERVED_ROOT_SEGMENTS = new Set([
  "tr",
  "de",
  "api",
  "_next",
  "_vercel",
  "demo",
  "invite",
  "olustur",
  "katalog",
  "panel",
  "gizlilik",
  "kosullar",
  "templates",
  "mesafeli-satis",
  "iptal-iade",
  "favicon",
  "robots",
  "sitemap",
]);

export function getPublicInvitation(slug: string): PublicInvitation | null {
  return DEMO[slug] ?? null;
}

/** Google Takvim şablon bağlantısı (UTC) */
export function buildGoogleCalendarUrl(inv: PublicInvitation): string {
  const start = new Date(inv.eventAt);
  const end = inv.eventEndAt
    ? new Date(inv.eventEndAt)
    : new Date(start.getTime() + 5 * 60 * 60 * 1000);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const dates = `${fmt(start)}/${fmt(end)}`;
  const q = new URLSearchParams({
    action: "TEMPLATE",
    text: `${inv.namesDisplay} · Davet`,
    details: inv.tagline,
    location: `${inv.venueName} — ${inv.venueAddress}`,
  });
  return `https://calendar.google.com/calendar/render?${q.toString()}&dates=${dates}`;
}

export function shouldRewriteRootToInvite(pathname: string): string | null {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  const m = normalized.match(/^\/([a-z0-9]+(?:-[a-z0-9]+)*)$/);
  if (!m?.[1]) return null;
  const seg = m[1];
  if (!seg.includes("-")) return null;
  if (RESERVED_ROOT_SEGMENTS.has(seg)) return null;
  return seg;
}
