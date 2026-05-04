"use client";

import { useLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div
      className="inline-flex items-center overflow-hidden rounded-2xl border border-brand/15 bg-white/90 p-0.5 shadow-sm backdrop-blur-md"
      role="group"
      aria-label="Language"
    >
      {routing.locales.map((code) => {
        const active = locale === code;
        return (
          <button
            key={code}
            type="button"
            aria-pressed={active}
            aria-current={active ? "true" : undefined}
            onClick={() => router.replace(pathname, { locale: code })}
            className={cn(
              "min-h-9 min-w-[2.5rem] px-2 py-1.5 text-[0.62rem] font-bold tracking-[0.1em] transition-all duration-300 sm:min-w-[2.75rem] sm:px-2.5 sm:text-[0.68rem] sm:tracking-[0.12em]",
              active
                ? "rounded-xl bg-gradient-to-br from-brand to-brand-hover text-white shadow-md"
                : "rounded-xl text-muted hover:bg-brand-muted hover:text-brand",
            )}
          >
            {code.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
