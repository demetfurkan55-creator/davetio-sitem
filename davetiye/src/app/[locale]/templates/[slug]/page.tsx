import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { slugToMessageKey, TEMPLATE_SLUGS } from "@/data/templates";
import { AmbientPhotoBackdrop } from "@/components/ui/AmbientPhotoBackdrop";
import { SITE_AMBIENT } from "@/lib/site-ambient";
import { TemplateDetailClient } from "./TemplateDetailClient";

type Messages = {
  TemplatesCatalog: Record<string, { title: string; intro: string }>;
  Landing: {
    templates: {
      items: Array<{
        slug: string;
        image: string;
        imageAlt: string;
      }>;
    };
  };
};

export function generateStaticParams() {
  return TEMPLATE_SLUGS.map((slug) => ({ slug }));
}

export default async function TemplatePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!TEMPLATE_SLUGS.includes(slug as (typeof TEMPLATE_SLUGS)[number])) {
    notFound();
  }
  setRequestLocale(locale);
  const messages = (await getMessages()) as Messages;
  const catalog = messages.TemplatesCatalog;
  const key = slugToMessageKey(slug);
  const entry = catalog[key];
  if (!entry) {
    notFound();
  }
  const tpl = messages.Landing.templates.items.find((x) => x.slug === slug);
  if (!tpl) {
    notFound();
  }
  const tNav = await getTranslations({ locale, namespace: "TemplateDetail" });

  return (
    <div className="relative min-h-full overflow-hidden bg-canvas pb-24">
      <AmbientPhotoBackdrop
        src={SITE_AMBIENT.ringsSoft}
        overlayClassName="bg-gradient-to-b from-canvas/92 via-canvas/82 to-canvas/96"
      />
      <div className="relative z-10">
        <div className="border-b border-black/[0.06] bg-white/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center px-5 py-4 sm:px-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-bold text-brand transition-colors hover:text-brand-hover"
            >
              <ArrowLeft className="size-4" aria-hidden />
              {tNav("back")}
            </Link>
          </div>
        </div>
        <TemplateDetailClient slug={slug} title={entry.title} intro={entry.intro} />
      </div>
    </div>
  );
}
