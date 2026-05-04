import { setRequestLocale } from "next-intl/server";
import { PanelClient } from "@/components/panel/PanelClient";

export default async function PanelPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <PanelClient />;
}
