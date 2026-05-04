const PEXELS_FALLBACK =
  "https://videos.pexels.com/video-files/3038213/3038213-hd_1920_1080_30fps.mp4";

type ResolveOpts = {
  /** Şablon veya veri dosyasından gelen isteğe bağlı URL */
  templateOverride?: string | null;
  /** Çevirideki `previewModal.videoSrc` gibi yedek */
  messageFallback?: string | null;
};

/**
 * Davetiye arka plan / atmosfer videosu.
 * Öncelik: şablon alanı → `NEXT_PUBLIC_INVITE_AMBIENT_VIDEO` (örn. `/videos/sizin-klip.mp4`) → mesaj yedeği → Pexels.
 * Mobil: `<video playsInline muted loop />` ile iOS’ta otomatik oynatma çalışır.
 */
export function resolveInviteVideoUrl(opts?: ResolveOpts): string {
  const t = opts?.templateOverride?.trim();
  if (t) return t;
  const env =
    typeof process !== "undefined"
      ? process.env.NEXT_PUBLIC_INVITE_AMBIENT_VIDEO?.trim()
      : undefined;
  if (env) return env;
  const msg = opts?.messageFallback?.trim();
  if (msg) return msg;
  return PEXELS_FALLBACK;
}
