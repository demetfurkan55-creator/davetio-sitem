import { redirect } from "next/navigation";
import { routing } from "@/i18n/routing";

/** Kök `/` isteğini varsayılan dile yönlendirir; asıl ana sayfa `app/[locale]/page.tsx` içindedir. */
export default function RootPage() {
  redirect(`/${routing.defaultLocale}`);
}
