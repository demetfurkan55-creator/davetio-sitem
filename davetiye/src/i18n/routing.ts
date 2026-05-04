import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["tr", "de"],
  defaultLocale: "tr",
  /** Sabit URL’ler (hash dahil) için dil önekinin her zaman net olması */
  localePrefix: "always",
});
