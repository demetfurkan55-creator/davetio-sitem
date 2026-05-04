import { getTranslations, setRequestLocale } from "next-intl/server";
import { LegalArticle } from "@/components/legal/LegalArticle";

export default async function CancellationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Legal" });
  const sections = t.raw("cancellationSections") as { title: string; body: string }[];

  return (
    <LegalArticle
      eyebrow={t("eyebrow")}
      title={t("cancellationTitle")}
      intro={t("cancellationIntro")}
      sections={sections}
      backLabel={t("backHome")}
    />
  );
}
