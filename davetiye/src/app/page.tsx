import { redirect } from "next/navigation";
import { routing } from "@/i18n/routing";

/**
 * Kök `/` → coğrafi varsayılan dile (`proxy.ts`).
 * Ana vitrin: `app/[locale]/page.tsx`.
 * Herkese açık davetiye kök URL’si `/{kebab-slug}` → içeride `app/invite/[slug]/page.tsx`’e rewrite edilir.
 */
export default function RootPage() {
  redirect(`/${routing.defaultLocale}`);
}
