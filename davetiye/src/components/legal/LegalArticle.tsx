import { Link } from "@/i18n/navigation";
import { AmbientPhotoBackdrop } from "@/components/ui/AmbientPhotoBackdrop";
import { SITE_AMBIENT } from "@/lib/site-ambient";

export type LegalSection = { title: string; body: string };

/**
 * Kurumsal yasal / bilgilendirme sayfaları — tipografi ve okuma rahatlığı öncelikli.
 */
export function LegalArticle({
  eyebrow,
  title,
  intro,
  sections,
  backLabel,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  sections: LegalSection[];
  backLabel: string;
}) {
  return (
    <main className="relative min-h-full overflow-hidden bg-canvas">
      <AmbientPhotoBackdrop
        src={SITE_AMBIENT.darkVelvet}
        overlayClassName="bg-gradient-to-b from-canvas/95 via-[#f8f6f2]/92 to-canvas/97"
        imageClassName="opacity-[0.045] sm:opacity-[0.055]"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Cg fill='none' stroke='%23141814' stroke-opacity='0.06'%3E%3Cpath d='M0 80h160M80 0v160'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
        aria-hidden
      />

      <article className="relative z-10 mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
        <header className="border-b border-ink/[0.08] pb-10">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.28em] text-brand">{eyebrow}</p>
          <h1 className="mt-4 font-display text-[clamp(1.65rem,4vw,2.35rem)] font-semibold leading-tight tracking-tight text-ink">
            {title}
          </h1>
          {intro ? (
            <p className="mt-4 max-w-2xl text-[1.05rem] leading-relaxed text-muted">{intro}</p>
          ) : null}
        </header>

        <div className="mt-12 space-y-12">
          {sections.map((s, i) => (
            <section
              key={`${s.title}-${i}`}
              className="rounded-2xl border border-ink/[0.06] bg-white/70 p-6 shadow-[var(--shadow-card)] backdrop-blur-sm sm:p-8"
            >
              <h2 className="border-l-[3px] border-seal-gold pl-4 font-display text-lg font-semibold leading-snug text-ink sm:text-xl">
                {s.title}
              </h2>
              <div className="mt-5 whitespace-pre-line text-[0.9375rem] leading-[1.75] text-ink/85">
                {s.body}
              </div>
            </section>
          ))}
        </div>

        <p className="mt-16 border-t border-ink/[0.06] pt-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-ink/10 bg-white/90 px-4 py-2.5 text-sm font-semibold text-brand shadow-sm transition hover:border-brand/25 hover:bg-white hover:text-brand-hover"
          >
            ← {backLabel}
          </Link>
        </p>
      </article>
    </main>
  );
}
