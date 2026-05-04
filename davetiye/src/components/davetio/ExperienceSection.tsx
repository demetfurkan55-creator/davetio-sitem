import { MapPin, Music2, Navigation } from "lucide-react";
import { AmbientPhotoBackdrop } from "@/components/ui/AmbientPhotoBackdrop";
import { GUEST_PHOTO_PREVIEW_URLS, SHARE_CARD_PREVIEW_URL } from "@/lib/invite-assets";
import { SITE_AMBIENT } from "@/lib/site-ambient";
import { cn } from "@/lib/utils";

export type ExperienceVisual =
  | "map"
  | "rsvp"
  | "countdown"
  | "music"
  | "photos"
  | "panel"
  | "share";

export type ExperienceItem = {
  type: ExperienceVisual;
  badge: string;
  title: string;
  desc: string;
};

const cardFrame =
  "group relative overflow-hidden rounded-2xl border border-ink/[0.07] shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] sm:h-56";

function BgLayer({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "absolute inset-0 bg-cover bg-center transition-transform duration-[1.1s] ease-out group-hover:scale-[1.045]",
        className,
      )}
      style={{ backgroundImage: `url(${src})` }}
      aria-hidden
    />
  );
}

function Visual({
  type,
  mapCta,
  sharePreviewTitle,
  musicPreviewLine,
}: {
  type: ExperienceVisual;
  mapCta: string;
  sharePreviewTitle: string;
  musicPreviewLine: string;
}) {
  switch (type) {
    case "map":
      return (
        <div className={cn(cardFrame, "h-52")}>
          <BgLayer src={SITE_AMBIENT.experienceLocation} />
          <div
            className="absolute inset-0 bg-gradient-to-t from-ink/72 via-ink/28 to-indigo-950/35"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.13]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 31px, rgba(255,255,255,0.55) 31px, rgba(255,255,255,0.55) 32px), repeating-linear-gradient(90deg, transparent, transparent 31px, rgba(255,255,255,0.45) 31px, rgba(255,255,255,0.45) 32px)",
            }}
            aria-hidden
          />
          <MapPin
            className="absolute left-1/2 top-[42%] z-[1] size-14 -translate-x-1/2 -translate-y-1/2 text-white drop-shadow-[0_4px_14px_rgba(0,0,0,0.45)]"
            strokeWidth={1.25}
            aria-hidden
          />
          <div className="absolute bottom-3 left-3 right-3 z-[1] flex items-center gap-2 rounded-xl bg-white/95 px-3 py-2 shadow-lg ring-1 ring-ink/[0.06] backdrop-blur-[2px]">
            <Navigation className="size-4 shrink-0 text-sky-600" aria-hidden />
            <span className="text-[0.65rem] font-semibold uppercase tracking-wide text-ink">
              {mapCta}
            </span>
          </div>
        </div>
      );
    case "rsvp":
      return (
        <div className={cn(cardFrame, "flex h-52 items-center justify-center")}>
          <BgLayer src={SITE_AMBIENT.experienceRsvp} />
          <div
            className="absolute inset-0 bg-gradient-to-br from-violet-400/45 via-purple-200/50 to-fuchsia-50/55"
            aria-hidden
          />
          <div
            className="absolute inset-0 opacity-[0.28] mix-blend-soft-light"
            style={{
              backgroundImage: `url(${SITE_AMBIENT.linenPaper})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            aria-hidden
          />
          <div className="relative z-[1] w-[88%] max-w-[220px] rounded-xl border border-white/80 bg-white/95 p-3 shadow-[0_20px_50px_-18px_rgba(88,28,135,0.45)] ring-1 ring-violet-200/60 backdrop-blur-sm">
            <p className="text-[0.6rem] font-bold uppercase tracking-wide text-violet-600">LCV</p>
            <div className="mt-2 flex justify-between gap-1 text-[0.7rem] font-semibold tabular-nums text-ink">
              <span className="text-emerald-600">✓ 12</span>
              <span className="text-amber-500">? 4</span>
              <span className="text-rose-500">✗ 2</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-violet-100">
              <div className="h-full w-2/3 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.55)]" />
            </div>
          </div>
        </div>
      );
    case "countdown":
      return (
        <div className={cn(cardFrame, "flex h-52 flex-col items-center justify-center")}>
          <BgLayer src={SITE_AMBIENT.experienceCountdown} />
          <div
            className="absolute inset-0 bg-gradient-to-b from-amber-200/50 via-orange-100/45 to-rose-50/55"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -right-8 -top-10 size-40 rounded-full bg-amber-300/35 blur-3xl"
            aria-hidden
          />
          <p className="relative z-[1] text-[0.6rem] font-bold uppercase tracking-widest text-amber-900/85 drop-shadow-sm">
            Geri sayım
          </p>
          <div className="relative z-[1] mt-3 flex gap-2 sm:gap-3">
            {[
              ["45", "gün"],
              ["12", "sa"],
              ["38", "dk"],
              ["07", "sn"],
            ].map(([n, u]) => (
              <div
                key={u}
                className="rounded-xl border border-white/70 bg-white/92 px-2.5 py-2 text-center shadow-md backdrop-blur-sm sm:px-3"
              >
                <div className="font-display text-xl font-medium text-ink sm:text-2xl">{n}</div>
                <div className="text-[0.55rem] uppercase text-muted">{u}</div>
              </div>
            ))}
          </div>
        </div>
      );
    case "music":
      return (
        <div className={cn(cardFrame, "flex h-52 items-center justify-center")}>
          <BgLayer src={SITE_AMBIENT.experienceMusic} />
          <div className="absolute inset-0 bg-gradient-to-br from-ink/75 via-brand/35 to-ink/88" aria-hidden />
          <div
            className="pointer-events-none absolute inset-x-8 bottom-8 flex h-10 items-end justify-center gap-1.5 opacity-[0.42]"
            aria-hidden
          >
            {[14, 24, 11, 30, 18, 34, 15].map((px, i) => (
              <span
                key={i}
                className="w-[3px] rounded-full bg-white/95 shadow-[0_0_10px_rgba(255,255,255,0.35)]"
                style={{ height: px }}
              />
            ))}
          </div>
          <div className="relative z-[1] flex w-[90%] max-w-[240px] items-center gap-3 rounded-full border border-white/25 bg-white/95 px-4 py-3 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.55)] backdrop-blur-md">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand text-white shadow-lg ring-2 ring-white/40">
              <Music2 className="size-5" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-ink">{musicPreviewLine}</p>
              <div className="mt-1 h-1 overflow-hidden rounded-full bg-brand-muted">
                <div className="h-full w-1/3 rounded-full bg-brand shadow-[0_0_10px_rgba(74,124,89,0.45)]" />
              </div>
            </div>
          </div>
        </div>
      );
    case "photos":
      return (
        <div className={cn(cardFrame, "flex h-52 flex-col items-center justify-center gap-3")}>
          <BgLayer src={SITE_AMBIENT.experiencePhotos} />
          <div
            className="absolute inset-0 bg-gradient-to-b from-emerald-700/35 via-emerald-600/25 to-white/88"
            aria-hidden
          />
          <div className="relative z-[1] flex gap-2">
            {GUEST_PHOTO_PREVIEW_URLS.map((src) => (
              <img
                key={src}
                src={src}
                alt=""
                width={48}
                height={48}
                className="size-12 rounded-lg border-2 border-white object-cover shadow-lg ring-2 ring-white/60"
                loading="lazy"
              />
            ))}
          </div>
          <span className="relative z-[1] rounded-full bg-emerald-600 px-3 py-1 text-[0.65rem] font-semibold text-white shadow-lg ring-2 ring-emerald-400/40">
            Anı yükle
          </span>
          <p className="relative z-[1] text-[0.6rem] font-medium text-ink/75 drop-shadow-sm">12 fotoğraf</p>
        </div>
      );
    case "panel":
      return (
        <div className={cn(cardFrame, "flex h-52 items-center justify-center")}>
          <BgLayer src={SITE_AMBIENT.experiencePanel} />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/65 via-slate-700/35 to-white/50" aria-hidden />
          <div className="relative z-[1] w-[88%] max-w-[220px] rounded-xl border border-white/75 bg-white/96 p-3 shadow-[0_22px_55px_-18px_rgba(15,23,42,0.55)] backdrop-blur-sm">
            <div className="flex items-center justify-between text-[0.6rem] font-bold text-ink">
              <span>Panel</span>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[0.55rem] font-semibold text-emerald-800">
                Canlı
              </span>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-center text-[0.65rem]">
              <div className="rounded-lg bg-slate-50 py-2 font-semibold text-ink">
                LCV
                <div className="text-lg text-brand">142</div>
              </div>
              <div className="rounded-lg bg-slate-50 py-2 font-semibold text-ink">
                Foto
                <div className="text-lg text-brand">48</div>
              </div>
            </div>
            <p className="mt-2 text-center text-[0.55rem] font-medium text-brand">Şifreli erişim</p>
          </div>
        </div>
      );
    case "share":
      return (
        <div className={cn(cardFrame, "flex h-52 items-center justify-center")}>
          <BgLayer src={SITE_AMBIENT.experienceShare} />
          <div className="absolute inset-0 bg-gradient-to-br from-teal-600/40 via-cyan-500/25 to-white/55" aria-hidden />
          <div className="relative z-[1] w-[88%] max-w-[200px] rounded-2xl border border-white/70 bg-white/96 p-3 shadow-[0_22px_55px_-18px_rgba(13,148,136,0.45)] backdrop-blur-sm ring-1 ring-teal-100/80">
            <div className="aspect-[4/3] overflow-hidden rounded-lg ring-1 ring-teal-100/90 shadow-inner">
              <img
                src={SHARE_CARD_PREVIEW_URL}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <p className="mt-2 truncate text-center text-[0.65rem] font-semibold text-ink">
              {sharePreviewTitle}
            </p>
            <p className="text-center text-[0.55rem] text-muted">davetio.app</p>
            <p className="mt-1 text-end text-[0.55rem] text-teal-600">✓✓</p>
          </div>
        </div>
      );
    default:
      return null;
  }
}

export function ExperienceSection({
  tag,
  title,
  subtitle,
  mapCta,
  sharePreviewTitle,
  musicPreviewLine,
  items,
}: {
  tag: string;
  title: string;
  subtitle: string;
  mapCta: string;
  sharePreviewTitle: string;
  musicPreviewLine: string;
  items: ExperienceItem[];
}) {
  return (
    <section
      id="deneyim"
      className="relative scroll-mt-28 overflow-hidden border-t border-ink/[0.06] bg-gradient-to-b from-white via-canvas to-canvas-muted py-16 sm:py-20 lg:scroll-mt-24"
    >
      <AmbientPhotoBackdrop
        src={SITE_AMBIENT.venueWarm}
        overlayClassName="bg-gradient-to-b from-white/82 via-canvas/74 to-[#ebe6de]/88"
      />
      <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8">
        <p className="text-center text-[0.65rem] font-bold uppercase tracking-[0.22em] text-brand">
          {tag}
        </p>
        <h2 className="mt-2 text-center font-display text-3xl font-extrabold tracking-tight text-ink sm:text-[2.1rem]">
          {title}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-muted sm:text-base">
          {subtitle}
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-2 lg:gap-8">
          {items.map((item) => (
            <article
              key={item.title}
              className="group rounded-[1.75rem] border border-ink/[0.07] bg-white/80 p-6 shadow-[var(--shadow-card)] backdrop-blur-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-brand/20 hover:shadow-[var(--shadow-card-hover)] sm:p-8"
            >
              <Visual
                type={item.type}
                mapCta={mapCta}
                sharePreviewTitle={sharePreviewTitle}
                musicPreviewLine={musicPreviewLine}
              />
              <span className="mt-5 inline-block rounded-full bg-brand-muted px-2.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wide text-brand">
                {item.badge}
              </span>
              <h3 className="mt-3 font-display text-xl font-bold text-ink sm:text-[1.35rem]">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
