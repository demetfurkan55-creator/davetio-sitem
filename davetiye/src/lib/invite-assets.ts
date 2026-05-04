/**
 * Canlı harita önizlemesi (iframe) — `staticmap.openstreetmap.de` img sık kırıldığı için
 * OSM embed kullanılır; tıklama Google Haritalar’da açılır.
 */
export const INVITE_MAP_EMBED_TR =
  "https://www.openstreetmap.org/export/embed.html?bbox=28.992%2C41.034%2C29.024%2C41.052&layer=mapnik";

export const INVITE_MAP_EMBED_DE =
  "https://www.openstreetmap.org/export/embed.html?bbox=13.38%2C52.50%2C13.45%2C52.54&layer=mapnik";

/** WhatsApp / link önizlemesi mock — düğün temalı */
export const SHARE_CARD_PREVIEW_URL =
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=640&q=78&auto=format&fit=crop";

/** Misafir galerisi mock küçük görseller */
export const GUEST_PHOTO_PREVIEW_URLS = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=128&h=128&q=78&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1464366400600-1168ab8dbe43?w=128&h=128&q=78&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=128&h=128&q=78&auto=format&fit=crop",
] as const;
