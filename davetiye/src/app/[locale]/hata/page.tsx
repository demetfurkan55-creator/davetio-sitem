import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function PaymentErrorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Landing.shopier" });

  return (
    <div className="min-h-[100dvh] bg-[#fdf9f9] px-5 py-20 text-center sm:px-8">
      <div className="mx-auto max-w-md rounded-3xl border border-[#6b1d2e]/12 bg-white/80 px-8 py-12 shadow-[0_24px_60px_-28px_rgba(60,20,30,0.18)] backdrop-blur-sm">
        <h1 className="font-display text-2xl font-semibold text-[#4a1420]">{t("errorPageTitle")}</h1>
        <p className="mt-4 text-base leading-relaxed text-[#5e5658]">{t("errorPageBody")}</p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center rounded-2xl bg-[#6b1d2e] px-8 py-3 text-sm font-semibold text-white shadow-[0_12px_32px_-12px_rgba(107,29,46,0.4)] transition hover:bg-[#551825]"
        >
          {t("errorPageCta")}
        </Link>
      </div>
    </div>
  );
}
