import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { AmbientPhotoBackdrop } from "@/components/ui/AmbientPhotoBackdrop";
import { SITE_AMBIENT } from "@/lib/site-ambient";

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Legal" });

  return (
    <main className="relative min-h-full overflow-hidden bg-canvas px-5 py-14 sm:px-8">
      <AmbientPhotoBackdrop
        src={SITE_AMBIENT.linenPaper}
        overlayClassName="bg-gradient-to-b from-canvas/93 via-canvas/82 to-canvas/96"
      />
      <article className="relative z-10 mx-auto max-w-2xl">
        <h1 className="font-display text-3xl font-semibold text-ink">{t("privacyTitle")}</h1>
        <p className="mt-6 text-base leading-relaxed text-muted">{t("privacyBody")}</p>
        <p className="mt-10">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand underline-offset-4 transition-colors hover:text-brand-hover hover:underline"
          >
            ← {t("backHome")}
          </Link>
        </p>
      </article>
    </main>
  );
}
