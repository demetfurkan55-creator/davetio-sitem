import { getTranslations, setRequestLocale } from "next-intl/server";
import { LegalArticle } from "@/components/legal/LegalArticle";

export default async function DistanceSalesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Legal" });
  const sections = t.raw("distanceSections") as { title: string; body: string }[];

  return (
    <LegalArticle
      eyebrow={t("eyebrow")}
      title={t("distanceTitle")}
      intro={t("distanceIntro")}
      sections={sections}
      backLabel={t("backHome")}
    />
  );
}
