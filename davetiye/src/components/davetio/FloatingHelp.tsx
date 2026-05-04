"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ChevronDown, MessageCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

type FaqItem = { q: string; a: string };

export function FloatingHelp() {
  const locale = useLocale();
  const tHelp = useTranslations("HelpChat");
  const tFaq = useTranslations("FAQ");
  const items = tFaq.raw("items") as FaqItem[];

  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-[39] cursor-default bg-ink/20 backdrop-blur-[2px]"
          aria-label={tHelp("closeLabel")}
          onClick={() => setOpen(false)}
        />
      ) : null}

      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 sm:bottom-8 sm:right-8">
        {open ? (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="help-chat-title"
            className="flex max-h-[min(72vh,28rem)] w-[min(100vw-2.5rem,22.5rem)] flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-[0_24px_80px_-20px_rgba(22,24,20,0.38)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 items-start justify-between gap-2 border-b border-ink/[0.06] bg-gradient-to-r from-[#fff5f8] to-white px-4 py-3.5">
              <div className="min-w-0 pr-2">
                <p id="help-chat-title" className="font-display text-base font-semibold text-ink">
                  {tHelp("title")}
                </p>
                <p className="mt-0.5 text-[0.7rem] leading-snug text-muted">{tHelp("pickQuestion")}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="shrink-0 rounded-xl p-2 text-muted transition-colors hover:bg-ink/5 hover:text-ink"
                aria-label={tHelp("closeLabel")}
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>

            <ul className="min-h-0 flex-1 space-y-0.5 overflow-y-auto overscroll-contain px-2 py-2">
              {items.map((item, i) => {
                const isOpen = expanded === i;
                return (
                  <li key={`faq-${i}`} className="rounded-xl">
                    <button
                      type="button"
                      id={`help-q-${i}`}
                      aria-expanded={isOpen}
                      aria-controls={`help-a-${i}`}
                      onClick={() => setExpanded(isOpen ? null : i)}
                      className={cn(
                        "flex w-full items-start gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors",
                        isOpen
                          ? "bg-brand-muted/90 text-ink"
                          : "text-ink hover:bg-canvas-muted/95",
                      )}
                    >
                      <span className="min-w-0 flex-1 leading-snug">{item.q}</span>
                      <ChevronDown
                        className={cn(
                          "mt-0.5 size-4 shrink-0 text-brand transition-transform duration-200",
                          isOpen && "rotate-180",
                        )}
                        aria-hidden
                      />
                    </button>
                    {isOpen ? (
                      <div
                        id={`help-a-${i}`}
                        role="region"
                        aria-labelledby={`help-q-${i}`}
                        className="border-l-2 border-brand/35 px-3 pb-3 pl-4 pt-1 text-[0.8125rem] leading-relaxed text-muted"
                      >
                        <p className="rounded-lg bg-canvas-muted/50 px-3 py-2.5">{item.a}</p>
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>

            <div className="shrink-0 border-t border-ink/[0.06] bg-white px-3 py-2.5">
              <a
                href={`/${locale}#sss`}
                className="block text-center text-xs font-semibold text-brand underline-offset-2 hover:underline"
                onClick={() => setOpen(false)}
              >
                {tHelp("fullFaqLink")}
              </a>
            </div>
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-haspopup="dialog"
          aria-label={open ? tHelp("closeLabel") : tHelp("openLabel")}
          className={cn(
            "flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-hover text-white shadow-[var(--shadow-button)] transition-transform duration-300 hover:scale-110 hover:rotate-[-4deg] active:scale-95",
            !open && "davetio-fab-pulse",
          )}
        >
          {open ? (
            <X className="size-7" strokeWidth={1.5} aria-hidden />
          ) : (
            <MessageCircle className="size-7" strokeWidth={1.5} aria-hidden />
          )}
        </button>
      </div>
    </>
  );
}
