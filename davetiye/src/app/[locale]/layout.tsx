import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { SetHtmlLang } from "@/components/SetHtmlLang";
import { routing } from "@/i18n/routing";
import { SITE_AMBIENT } from "@/lib/site-ambient";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      images: [{ url: SITE_AMBIENT.heroBloom, width: 1920, height: 1080, alt: "Davetio" }],
    },
    twitter: {
      card: "summary_large_image",
      images: [SITE_AMBIENT.heroBloom],
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <SetHtmlLang locale={locale} />
      {children}
    </NextIntlClientProvider>
  );
}
