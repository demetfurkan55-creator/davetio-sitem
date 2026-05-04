import { setRequestLocale } from "next-intl/server";
import { PanelTokenClient } from "@/components/panel/PanelTokenClient";

export const dynamic = "force-dynamic";

export default async function PanelTokenPage({
  params,
}: {
  params: Promise<{ locale: string; token: string }>;
}) {
  const { locale, token } = await params;
  setRequestLocale(locale);

  return <PanelTokenClient token={token} />;
}
