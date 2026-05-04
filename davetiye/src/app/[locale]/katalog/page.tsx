import { setRequestLocale } from "next-intl/server";
import { DavetioCatalogHome } from "@/components/catalog/DavetioCatalogHome";

export default async function KatalogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <DavetioCatalogHome />;
}
